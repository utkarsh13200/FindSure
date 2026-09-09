import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../index.js";
import { prisma } from "../db/prisma.js";

const app = createApp();

describe("API", () => {
  let businessId: string;
  let techFixId: string;

  beforeAll(async () => {
    const count = await prisma.business.count();
    if (count === 0) {
      throw new Error("Database empty — run npm run db:seed first");
    }
    const any = await prisma.business.findFirst({ where: { name: "LaptopCare Solutions" } });
    const tech = await prisma.business.findFirst({ where: { name: "TechFix Hub" } });
    businessId = any!.id;
    techFixId = tech!.id;
  });

  it("GET /api/health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/businesses/search", async () => {
    const res = await request(app).get("/api/businesses/search").query({
      q: "laptop repair",
      lat: 12.97,
      lng: 77.59,
    });
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.businesses[0].trust).toBeDefined();
  });

  it("GET /api/businesses/:id", async () => {
    const res = await request(app).get(`/api/businesses/${businessId}`);
    expect(res.status).toBe(200);
    expect(res.body.business.name).toBe("LaptopCare Solutions");
  });

  it("GET /api/businesses/:id/trust", async () => {
    const res = await request(app).get(`/api/businesses/${businessId}/trust`);
    expect(res.status).toBe(200);
    expect(res.body.score).toBeGreaterThan(0);
  });

  it("POST report updates trust state", async () => {
    const before = await request(app).get(`/api/businesses/${techFixId}/trust`);
    const res = await request(app)
      .post(`/api/businesses/${techFixId}/reports`)
      .send({ type: "MOVED", description: "Test report from vitest" });
    expect(res.status).toBe(201);
    expect(res.body.business.trust.relocationReports).toBeGreaterThanOrEqual(
      before.body.relocationReports
    );
    expect(res.body.business.trust.score).toBeLessThanOrEqual(before.body.score);
  });

  it("POST confirmation works", async () => {
    const res = await request(app)
      .post(`/api/businesses/${businessId}/confirm`)
      .send({ type: "LOCATION_CONFIRMED" });
    expect(res.status).toBe(201);
    expect(res.body.confirmation.type).toBe("LOCATION_CONFIRMED");
  });
});
