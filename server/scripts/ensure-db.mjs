/**
 * Railway / production boot helper:
 * 1) Apply Prisma migrations
 * 2) Seed demo data when empty OR when the demo seed generation is outdated
 *    (detected via a marker shop from the latest city expansion).
 * Keeps routine restarts from wiping data once the current seed is present.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

execSync("npx prisma migrate deploy", { stdio: "inherit" });

const prisma = new PrismaClient();
try {
  const count = await prisma.business.count();
  // Marker from the 99-city / 8-shops / 10 km seed (findsure-v4).
  const latestSeedMarker = await prisma.business.findFirst({
    where: { googlePlaceId: { startsWith: "demo_v4_" } },
    select: { id: true },
  });

  if (count === 0 || !latestSeedMarker) {
    console.log(
      count === 0
        ? "Database empty — running demo seed…"
        : `Outdated demo seed (${count} businesses, missing latest cities) — reseeding…`
    );
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  } else {
    console.log(`Database ready (${count} businesses). Skipping seed.`);
  }
} finally {
  await prisma.$disconnect();
}
