// import util from "util";
// import Multer from "multer";

// const maxSize =
//   process.env.IMAGE_SIZE_LIMIT_MB * 1024 * 1024 || 1 * 1024 * 1024;
// const maxFiles = process.env.MAX_FILES_LIMIT || 5;

// const upload = Multer({
//   storage: Multer.memoryStorage(),
//   limits: { fileSize: maxSize },
// }).any(); // Accept any file field

// const processFiles = util.promisify(upload);
// export default processFiles;

import multer from "multer";
import path from "path";
import crypto from "crypto";
import { FILE_SIZE_LIMIT_MB, MAX_FILES_LIMIT } from "../config/config.js";

const storage = multer.diskStorage({
  destination: "/tmp", // App Engine Standard only allows writing here
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMIT_MB * 1024 * 1024,
    files: MAX_FILES_LIMIT,
  },
});
