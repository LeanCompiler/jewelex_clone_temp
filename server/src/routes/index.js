import { Router } from "express";
import orderRouter from "./orderRoutes.js";

const router = Router();

router.use("/order", orderRouter);

export default router;
