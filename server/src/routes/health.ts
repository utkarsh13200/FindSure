import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "findsure-api",
    demoMode: process.env.DEMO_MODE === "true",
    timestamp: new Date().toISOString(),
  });
});

export default router;
