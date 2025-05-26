import { Router } from "express";
import { createShortUrl, getUrl } from "../controllers/urlController.js";

const router = Router();

router.post("/", createShortUrl);
router.get("/", getUrl);

export default router;
