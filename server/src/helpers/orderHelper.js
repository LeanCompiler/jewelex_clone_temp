import { fileTypeFromFile } from "file-type";
import {
  ALLOWED_FILE_TYPES,
  SERVER_BASE_URL,
  UPLOADS_NGINX_LOCATION,
} from "../config/config.js";

export const validateMediaFiles = async (files) => {
  try {
    for (const file of files) {
      const type = await fileTypeFromFile(file.path);
      if (!type || !ALLOWED_FILE_TYPES.includes(type.mime.split("/")[0])) {
        console.error(
          `Blocked file: ${file.originalname} - Detected as ${type?.mime}`
        );
        return false;
      }

      return true;
    }
  } catch (error) {
    throw new Error("Error validating media files:", error);
  }
};

export const fileNamesToUrls = (fileNames) => {
  return fileNames.map(
    (fileName) => `${SERVER_BASE_URL}${UPLOADS_NGINX_LOCATION}/${fileName}`
  );
};
