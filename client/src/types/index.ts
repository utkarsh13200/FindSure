export type ConfidenceLevel = "high" | "medium" | "low";

export type ConcernState =
  | "NO_CONCERN"
  | "NEEDS_VERIFICATION"
  | "POTENTIALLY_MOVED"
  | "POTENTIALLY_CLOSED";

export type TrustInfo = {
  score: number;
  confidence: ConfidenceLevel;
  lastVerifiedAt: string | null;
  recentConfirmations: number;
  relocationReports: number;
  closureReports: number;
  notFoundReports: number;
  concernState: ConcernState;
  signals?: Record<string, number>;
};

export type Confirmation = {
  id?: string;
  type: string;
  source: string;
  createdAt: string;
};

export type Report = {
  id: string;
  type: string;
  description: string | null;
  status: string;
  createdAt: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  reviewDate: string;
  source: string;
};

export type Business = {
  id: string;
  googlePlaceId: string | null;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number;
  googleMapsUrl: string | null;
  openNow: boolean;
  distanceKm: number | null;
  trust: TrustInfo;
  confirmations: Confirmation[];
  reports: Report[];
  reviews: Review[];
};

export type SearchResponse = {
  demoMode: boolean;
  center: { lat: number; lng: number };
  count: number;
  businesses: Business[];
};

export type SearchParams = {
  q: string;
  lat: number;
  lng: number;
  sort?: string;
  trust?: string;
  openNow?: boolean;
  recentlyVerified?: boolean;
  outdated?: boolean;
  minRating?: number;
  maxDistance?: number;
};

export type ReportType =
  | "MOVED"
  | "CLOSED"
  | "DOES_NOT_EXIST"
  | "WRONG_ADDRESS"
  | "WRONG_PHONE"
  | "WRONG_CATEGORY"
  | "OTHER";
