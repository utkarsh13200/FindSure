/**
 * Seed demo data when empty or outdated. Safe to run after the API is already listening.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  const count = await prisma.business.count();
  const latestSeedMarker = await prisma.business.findFirst({
    where: { googlePlaceId: { startsWith: "demo_v4_" } },
    select: { id: true },
  });

  if (count === 0 || !latestSeedMarker) {
    console.log(
      count === 0
        ? "Database empty — running demo seed…"
        : `Outdated demo seed (${count} businesses) — reseeding…`
    );
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  } else {
    console.log(`Database ready (${count} businesses). Skipping seed.`);
  }
} catch (err) {
  console.error("Seed-if-needed failed:", err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
