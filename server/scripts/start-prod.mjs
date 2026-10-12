/**
 * Production boot for Railway:
 * 1) Apply migrations (fast)
 * 2) Start HTTP server immediately so healthchecks pass
 * 3) Seed demo data in the background if needed
 */
import { execSync, spawn } from "node:child_process";

console.log("Applying Prisma migrations…");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("Starting FindSure API…");
const server = spawn("node", ["dist/index.js"], {
  stdio: "inherit",
  env: process.env,
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});

// Seed after the process is up — do not block /api/health.
const seeder = spawn("node", ["scripts/seed-if-needed.mjs"], {
  stdio: "inherit",
  env: process.env,
});
seeder.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`Background seed exited with code ${code}`);
  }
});
