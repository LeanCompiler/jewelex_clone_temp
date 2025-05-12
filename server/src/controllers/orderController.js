import { saveFilesToDisk } from "../services/fileService.js";
import { sendToKapture } from "../services/crmService.js";
import { buildKapturePayload } from "../helpers/crmHelper.js";
import { fileNamesToUrls, validateMediaFiles } from "../helpers/orderHelper.js";

export const orderByMedia = async (req, res, next) => {
  try {
    const { user_id, email, phone, description } = req.body;
    const files = req.files;

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

    let fileNames = [];
    if (!isFilesEmpty) {
      const isValid = await validateMediaFiles(files);
      if (!isValid) {
        console.error("Invalid media files for user: ", user_id);
        return res.status(400).json({
          success: false,
          message: "Invalid media files",
        });
      }

      fileNames = await saveFilesToDisk(files, user_id);
      if (fileNames.length === 0) {
        throw new Error("Failed to save files to disk for user: ", user_id);
      }

      console.log(
        `${fileNames.length} Files saved to disk for user ${user_id}: ${fileNames.join(", ")}`
      );
    }

    const fileUrls = fileNamesToUrls(fileNames);

    // Debug logs
    console.debug("All files uploaded.");
    console.debug("user_id:", user_id);
    console.debug("fileUrls:", fileUrls);

    // Build and send payload to Kapture
    const crmPayload = buildKapturePayload(
      { user_id, email, phone },
      fileUrls,
      description
    );
    await sendToKapture(crmPayload);

    console.log(
      `Order placed successfully with ${fileUrls.length} files for user ${user_id}`
    );
    return res.status(200).json({
      success: true,
      message: `Order placed successfully with ${fileUrls.length} files for user ${user_id}`,
      data: { crmPayload: crmPayload },
    });
  } catch (error) {
    console.error("Error in orderByImage:", error);
    next(error);
  }
};
