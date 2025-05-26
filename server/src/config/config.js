import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8082;
export const API_KEY = process.env.API_KEY || "";
export const SERVER_BASE_URL =
  process.env.SERVER_BASE_URL || `https://i.jewelex.biz`;
export const URLS_DB_PATH = process.env.URLS_DB_PATH || "./data/urls.db";

export const FILE_SIZE_LIMIT_MB = parseInt(
  process.env.FILE_SIZE_LIMIT_MB || "1",
  10
);
export const MAX_FILES_LIMIT = parseInt(
  process.env.MAX_FILES_LIMIT || "10",
  10
);

export const UPLOADS_NGINX_LOCATION =
  process.env.UPLOADS_NGINX_LOCATION || "/uploads";
export const UPLOADS_WRITE_DIR = process.env.UPLOADS_WRITE_DIR || "";
export const MAX_WRITE_RETRIES = parseInt(
  process.env.MAX_WRITE_RETRIES || "2",
  10
);
export const ALLOWED_FILE_TYPES = (
  process.env.ALLOWED_FILE_TYPES || "image,video,application"
)
  .split(",")
  .map((type) => type.trim());
export const ALLOWED_MIME_TYPES = (
  process.env.ALLOWED_MIME_TYPES ||
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf"
)
  .split(",")
  .map((type) => type.trim());

export const KAPTURE_URL =
  process.env.KAPTURE_URL ||
  "https://jewelex.kapturecrm.com/add-ticket-from-other-source.html/v.2.0";
export const KAPTURE_AUTH_TOKEN = process.env.KAPTURE_AUTH_TOKEN || "";
