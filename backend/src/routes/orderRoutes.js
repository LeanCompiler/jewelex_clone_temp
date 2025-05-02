import { Router } from "express";
import { orderByImage } from "../controllers/orderController.js";
import { upload } from "../utils/processFiles.js";

const router = Router();

// const upload = multer({ storage: multer.memoryStorage() });
// router.post("/image", upload.array("files"), orderByImage);

router.post("/image", upload.array("files", 10), orderByImage);

export default router;
