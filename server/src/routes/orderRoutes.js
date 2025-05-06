import { Router } from "express";
import { orderByMedia } from "../controllers/orderController.js";
import { upload } from "../middlewares/multer.js";
import { MAX_FILES_LIMIT } from "../config/config.js";

const router = Router();

router.post("/media", upload.array("files", MAX_FILES_LIMIT), orderByMedia);

export default router;
