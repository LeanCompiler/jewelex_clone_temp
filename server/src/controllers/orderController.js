import { saveFilesToDisk } from "../services/fileService.js";
import { sendToKapture } from "../services/crmService.js";
import { buildKapturePayload } from "../helpers/crmHelper.js";
import { fileNamesToUrls, validateMediaFiles } from "../helpers/orderHelper.js";

export const orderByMedia = async (req, res, next) => {
  try {
    const {
      user_id: userId,
      email,
      phone,
      customer_code: customerCode,
      description,
    } = req.body;
    const files = req.files;

    const isDescriptionEmpty = !description?.trim();
    const isFilesEmpty = !Array.isArray(files) || files.length === 0;
    if (!phone || (isDescriptionEmpty && isFilesEmpty)) {
      console.error(
        `Missing required fields: ${JSON.stringify(req.body)} files:${JSON.stringify(Array.isArray(files) ? files.map((file) => file.originalname) : [])}`
      );
      return res.status(400).json({
        success: false,
        message:
          "Phone number and at least one of description or files is required",
      });
    }

    console.log(
      `Received request for user ${phone}: data:${JSON.stringify(req.body)} files:${JSON.stringify(
        Array.isArray(files) ? files.map((file) => file.originalname) : []
      )}`
    );

    let fileNames = [];
    if (!isFilesEmpty) {
      const isValid = await validateMediaFiles(files);
      if (!isValid) {
        console.error("Invalid media files for user: ", phone);
        return res.status(400).json({
          success: false,
          message: "Invalid media files",
        });
      }

      fileNames = await saveFilesToDisk(files, phone);
      if (fileNames.length === 0) {
        throw new Error("Failed to save files to disk for user: ", phone);
      }

      console.log(
        `${fileNames.length} Files saved to disk for user ${phone}: ${fileNames.join(", ")}`
      );
    }

    const fileUrls = fileNamesToUrls(fileNames);

    // Debug logs
    console.debug("All files uploaded.");
    console.debug("userId:", userId);
    console.debug("phone:", phone);
    console.debug("customerCode:", customerCode);
    console.debug("fileUrls:", fileUrls);

    // Build and send payload to Kapture
    const crmPayload = buildKapturePayload(
      { userId, email, phone, customerCode },
      fileUrls,
      description
    );
    const crmResponseData = await sendToKapture(crmPayload);

    console.log(
      `Order placed successfully with ${fileUrls.length} files for user ${phone}`
    );
    return res.status(200).json({
      success: true,
      message: `Order placed successfully with ${fileUrls.length} files for user ${phone}`,
      data: { crmPayload: crmPayload, crmResponseData: crmResponseData },
    });
  } catch (error) {
    console.error("Error in orderByImage:", error);
    next(error);
  }
};
