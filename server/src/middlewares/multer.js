import multer from "multer";
import path from "path";
import crypto from "crypto";
import {
  ALLOWED_MIME_TYPES,
  FILE_SIZE_LIMIT_MB,
  MAX_FILES_LIMIT,
} from "../config/config.js";

const storage = multer.diskStorage({
  destination: "/tmp",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMIT_MB * 1024 * 1024,
    files: MAX_FILES_LIMIT,
  },
});
