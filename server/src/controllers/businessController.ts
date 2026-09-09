import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as businessService from "../services/businessService.js";
import { AppError } from "../middleware/errorHandler.js";

const reportSchema = z.object({
  type: z.enum([
    "MOVED",
    "CLOSED",
    "DOES_NOT_EXIST",
    "WRONG_ADDRESS",
    "WRONG_PHONE",
    "WRONG_CATEGORY",
    "OTHER",
  ]),
  description: z.string().max(2000).optional(),
  reporterName: z.string().max(120).optional(),
  reporterEmail: z.string().email().optional().or(z.literal("")),
});

const confirmSchema = z.object({
  type: z.enum([
    "LOCATION_CONFIRMED",
    "BUSINESS_OPEN",
    "ADDRESS_CORRECT",
    "BUSINESS_FOUND",
  ]),
  source: z.string().max(60).optional(),
});

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await businessService.searchBusinesses({
      q: req.query.q as string | undefined,
      lat: req.query.lat ? Number(req.query.lat) : undefined,
      lng: req.query.lng ? Number(req.query.lng) : undefined,
      category: req.query.category as string | undefined,
      sort: req.query.sort as string | undefined,
      filterTrust: req.query.trust as string | undefined,
      filterOpenNow: req.query.openNow === "true",
      filterRecentlyVerified: req.query.recentlyVerified === "true",
      filterOutdated: req.query.outdated === "true",
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      maxDistanceKm: req.query.maxDistance ? Number(req.query.maxDistance) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await businessService.getBusinessById(
      req.params.id,
      req.query.lat ? Number(req.query.lat) : undefined,
      req.query.lng ? Number(req.query.lng) : undefined
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTrust(req: Request, res: Response, next: NextFunction) {
  try {
    const trust = await businessService.getTrust(req.params.id);
    res.json(trust);
  } catch (err) {
    next(err);
  }
}

export async function createReport(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Invalid report", 400);
    }
    const payload = {
      ...parsed.data,
      reporterEmail: parsed.data.reporterEmail || undefined,
    };
    const result = await businessService.createReport(req.params.id, payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createConfirmation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = confirmSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Invalid confirmation", 400);
    }
    const result = await businessService.createConfirmation(req.params.id, parsed.data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    const reports = await businessService.getReports(req.params.id);
    res.json({ reports });
  } catch (err) {
    next(err);
  }
}

export async function getReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await businessService.getReviews(
      req.params.id,
      (req.query.sort as string) ?? "recent"
    );
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}
