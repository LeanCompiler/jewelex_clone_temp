import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Rate Limiter Setup
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5000,
  keyGenerator: (req) => req.ip,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

const appLoader = (app) => {
  // app.set("trust proxy", true);
  app.set("trust proxy", 2);
  app.use(limiter);

  app.use(
    cors({
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders: "Content-Type, Authorization",
    })
  );
  // app.options("*", cors());

  app.use(compression());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    express.json({
      limit: "60mb",
    })
  );
  app.use((err, req, res, next) => {
    if (err.type === "entity.too.large") {
      return res
        .status(413)
        .json({ error: "Payload Too Large. Limit is 60MB." });
    }
    next(err);
  });
};

export default appLoader;
