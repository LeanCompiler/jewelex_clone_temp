import fetchBucket from "../utils/cloudStorage.js";
import axios from "axios";
import {
  ORDER_IMAGE_APPSCRIPT_URL,
  KAPTURE_URL,
  KAPTURE_AUTH_TOKEN,
} from "../config/config.js";
import fs from "fs";

const orderImageAppscriptUrl = ORDER_IMAGE_APPSCRIPT_URL || "";

export const orderByImage = async (req, res) => {
  try {
    if (!orderImageAppscriptUrl) {
      throw new Error("Missing ORDER_IMAGE_APPSCRIPT_URL env var");
    }

    const { user_id, email, phone, description } = req.body;
    const files = req.files;
    // if (
    //   !user_id ||
    //   !description ||
    //   !Array.isArray(files) ||
    //   files.length === 0
    // ) {
    //   console.error(
    //     `Missing required fields: ${JSON.stringify(req.body)} files:${JSON.stringify(Array.isArray(files) ? files.map((file) => file.originalname) : [])}`
    //   );
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Missing required fields" });
    // }
    const isDescriptionEmpty = !description?.trim();
    const isFilesEmpty = !Array.isArray(files) || files.length === 0;
    if (!user_id || (isDescriptionEmpty && isFilesEmpty)) {
      console.error(
        `Missing required fields: ${JSON.stringify(req.body)} files:${JSON.stringify(Array.isArray(files) ? files.map((file) => file.originalname) : [])}`
      );
      return res.status(400).json({
        success: false,
        message: "At least one of description or files is required",
      });
    }

    console.log(
      `Received request for user ${user_id}: data:${JSON.stringify(req.body)} files:${JSON.stringify(
        Array.isArray(files) ? files.map((file) => file.originalname) : []
      )}`
    );

    const fileUrls = [];
    if (!isFilesEmpty) {
      const bucket = fetchBucket();
      for (const file of files) {
        const destPath = `jewelex/orders/${user_id}/${file.filename}`;
        const blob = bucket.file(destPath);

        try {
          const { size } = fs.statSync(file.path);
          console.debug(
            `Uploading for user ${user_id}: ${file.filename} (${(size / 1024).toFixed(2)} KB)`
          );

          await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(file.path);
            const writeStream = blob.createWriteStream({ resumable: false });

            readStream.on("error", (err) => {
              console.error(
                `Read stream failed for file ${file.filename}`,
                err
              );
              reject(err);
            });

            writeStream.on("error", (err) => {
              console.error(
                `Write stream failed for file ${file.filename}`,
                err
              );
              reject(err);
            });

            writeStream.on("finish", async () => {
              try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destPath}`;
                fileUrls.push(publicUrl);
                resolve();
              } catch (err) {
                console.error(
                  `makePublic failed for file ${file.filename}`,
                  err
                );
                reject(err);
              }
            });

            readStream.pipe(writeStream);
          });
        } catch (err) {
          console.error(
            `Upload failed for user ${user_id}, file: ${file.filename}`,
            err
          );
        } finally {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkErr) {
            console.error(
              `Failed to clean up temp file: ${file.path}`,
              unlinkErr
            );
          }
        }
      }
    }

    // Debug logs
    console.debug("All files uploaded.");
    console.debug("user_id:", user_id);
    console.debug("fileUrls:", fileUrls);

    /* BUILD CRM PAYLOAD */
    const ticketInfoObj = {
      type: "",
      category: "",
      chat_link: "",
      reason: "",
      jewelery_type: "",
      remark: description,
    };
    if (!isFilesEmpty) {
      fileUrls.forEach((url, i) => {
        ticketInfoObj[`file_${i < 10 ? `0${i + 1}` : i + 1}`] = url;
      });
    }
    const crmPayload = [
      {
        title: "Order", // hard-coded
        ticket_details: "",
        due_date: "",
        customer_name: "AJP", // hard-coded
        phone,
        email_id: email,
        user_id,
        new_collections: [{ gender: "" }],
        ticket_info: [ticketInfoObj],
        webform: [{ upload_files: "", user_id: "", remarks: "" }],
        catalogs: [{ remarks: "", expedite: "", sku_number: "", quantity: "" }],
      },
    ];
    await sendToKapture(crmPayload);

    console.log(
      `Order placed successfully with ${fileUrls.length} files for user ${user_id}`
    );
    return res.json({
      success: true,
      message: `Order placed successfully with ${fileUrls.length} files for user ${user_id}`,
    });
  } catch (error) {
    console.error("Error in orderByImage:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendToKapture = async (ticketData) => {
  const userId = ticketData[0].user_id;
  try {
    console.debug(
      `Sending to Kapture for user ${userId}: `,
      JSON.stringify(ticketData)
    );

    const response = await axios.post(KAPTURE_URL, ticketData, {
      headers: {
        Authorization: `Basic ${KAPTURE_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to send to Kapture");
    }

    console.debug(
      `Response from Kapture for user ${userId}: `,
      JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending to Kapture for user ${userId}: `, error);
    throw error;
  }
};

/* 
SAMPLE PAYLOAD TO GOOGLE SHEETS
{
  "user_id": "ASD",
  "date": "18-03-2025 11:52:02 UTC",
  "orders": [
    {
      "images": [
        {
          "name": "jewelex/orders/ASD/1711345723456-0-0.jpg",
          "url": "https://storage.googleapis.com/bucket-name/jewelex/orders/ASD/1711345723456-0-0.jpg"
        },
        {
          "name": "jewelex/orders/ASD/1711345726789-0-1.jpg",
          "url": "https://storage.googleapis.com/bucket-name/jewelex/orders/ASD/1711345726789-0-1.jpg"
        }
      ],
      "remarks": "sadsad"
    }
  ]
}
*/
