import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { BusinessCard } from "../components/BusinessCard";
import { ReportModal } from "../components/ReportModal";
import {
  FiltersPanel,
  defaultFilters,
} from "../components/FiltersPanel";
import type { Business } from "../types";

const sampleBusiness: Business = {
  id: "b1",
  googlePlaceId: "demo",
  name: "LaptopCare Solutions",
  category: "laptop_repair",
  address: "123 MG Road",
  latitude: 12.97,
  longitude: 77.6,
  phone: "+91 80 1",
  website: null,
  rating: 4.5,
  reviewCount: 10,
  googleMapsUrl: null,
  openNow: true,
  distanceKm: 1.4,
  trust: {
    score: 92,
    confidence: "high",
    lastVerifiedAt: new Date().toISOString(),
    recentConfirmations: 12,
    relocationReports: 0,
    closureReports: 0,
    notFoundReports: 0,
    concernState: "NO_CONCERN",
  },
  confirmations: [],
  reports: [],
  reviews: [],
};

describe("BusinessCard", () => {
  it("renders trust score and actions", () => {
    render(
      <MemoryRouter>
        <BusinessCard business={sampleBusiness} />
      </MemoryRouter>
    );
    expect(screen.getByText("LaptopCare Solutions")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /directions/i })).toBeInTheDocument();
  });
});

describe("ReportModal", () => {
  it("submits a report", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ReportModal
        open
        businessName="TechFix Hub"
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    );
    await user.click(screen.getByRole("button", { name: /submit report/i }));
    expect(onSubmit).toHaveBeenCalled();
    expect(await screen.findByText(/report submitted/i)).toBeInTheDocument();
  });
});

describe("FiltersPanel", () => {
  it("changes sort option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FiltersPanel value={defaultFilters} onChange={onChange} />);
    await user.selectOptions(screen.getByLabelText(/sort/i), "trust");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "trust" })
    );
  });
});
