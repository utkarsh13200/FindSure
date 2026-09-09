/**
 * Railway / production boot helper:
 * 1) Apply Prisma migrations
 * 2) Seed demo data only when the Business table is empty
 * Keeps restarts from wiping user reports after the first seed.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

execSync("npx prisma migrate deploy", { stdio: "inherit" });

const prisma = new PrismaClient();
try {
  const count = await prisma.business.count();
  if (count === 0) {
    console.log("Database empty — running demo seed…");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  } else {
    console.log(`Database ready (${count} businesses). Skipping seed.`);
  }
} finally {
  await prisma.$disconnect();
}
