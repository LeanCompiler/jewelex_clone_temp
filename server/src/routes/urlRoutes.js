import { Router } from "express";
import { createShortUrl, getUrl, getUrls } from "../controllers/urlController.js";

const router = Router();

router.post("/", createShortUrl);
router.get("/", getUrl);
router.post("/", getUrls);

export default router;
