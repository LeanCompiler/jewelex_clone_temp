import { Router } from "express";
import { authorize } from "../middlewares/auth.js";
import orderRouter from "./orderRoutes.js";
import serverRouter from "./serverRoutes.js";
import urlRouter from "./urlRoutes.js";

const router = Router();

router.use("/order", authorize, orderRouter);
router.use("/server", authorize, serverRouter);
router.use("/url", authorize, urlRouter);

export default router;
