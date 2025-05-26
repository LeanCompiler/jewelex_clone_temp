import { Router } from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.status(200).send("server reachable");
});
router.get("/debug/req-ip", (req, res) => {
  res.json({
    ip: req.ip,
    ips: req.ips,
    forwarded: req.headers["x-forwarded-for"],
  });
});

export default router;
