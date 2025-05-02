import dotenv from "dotenv";
import express from "express";
import appLoader from "./loaders/appLoader.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

appLoader(app);

app.use("/api", router);
app.get("/server-check", (req, res) => {
  res.status(200).send("server reachable");
});
app.get("/debug-ip", (req, res) => {
  res.json({
    ip: req.ip,
    ips: req.ips,
    forwarded: req.headers["x-forwarded-for"],
  });
});

// Catch-all for 404
app.use((req, res) => {
  res.status(404).send({ message: "Sorry, this page doesn't exist!" });
});

app.listen(PORT, () => {
  console.log(`\n>>> Server running at http://${HOST}:${PORT}\n`);
});

// to prevent server crashes
// need to setup better logger later - for production
// async promise errors
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection at:", (error && error.stack) || error);
});

// sync errors - unhandled exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", (error && error.stack) || error);
  process.exit(1);
});
