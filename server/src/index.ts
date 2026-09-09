import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import businessesRouter from "./routes/businesses.js";
import healthRouter from "./routes/health.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/businesses", businessesRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createApp();

const port = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== "test") {
  // Bind all interfaces so Railway (and similar hosts) can reach the service.
  app.listen(port, "0.0.0.0", () => {
    console.log(`FindSure API listening on port ${port}`);
    console.log(`DEMO_MODE=${process.env.DEMO_MODE ?? "unset"}`);
  });
}

export default app;
