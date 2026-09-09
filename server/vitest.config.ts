import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    env: {
      DEMO_MODE: "true",
      DATABASE_URL: "file:./dev.db",
      NODE_ENV: "test",
    },
  },
});
