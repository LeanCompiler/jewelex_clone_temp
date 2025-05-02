import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const API_KEY = process.env.API_KEY || "";
export const BUCKET_NAME =
  process.env.BUCKET_NAME || "comportement-sandbox.appspot.com";
export const FILE_SIZE_LIMIT_MB = parseInt(
  process.env.FILE_SIZE_LIMIT_MB || "1",
  10
);
export const MAX_FILES_LIMIT = parseInt(
  process.env.MAX_FILES_LIMIT || "10",
  10
);
export const PROJECT_ID = process.env.PROJECT_ID || "comportement-sandbox";
export const PATH_TO_KEY =
  process.env.PATH_TO_KEY || "./comportement-sandbox-0915181d1539.json";
export const ORDER_IMAGE_APPSCRIPT_URL =
  process.env.ORDER_IMAGE_APPSCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzZS25Gc3gtTdYkX5puFTg5PTqd6Sr4vL66nzIlp9jlEKsOYg_8AOjofXUOrqQ5RpjkQg/exec";
export const KAPTURE_URL =
  process.env.KAPTURE_URL ||
  "https://jewelex.kapturecrm.com/add-ticket-from-other-source.html/v.2.0";
export const KAPTURE_AUTH_TOKEN = process.env.KAPTURE_AUTH_TOKEN || "";
