import { describe, test, expect, mock, beforeEach } from "bun:test";
import { renderHook, waitFor } from "@testing-library/react";
import { useVisas } from "./useVisas";
import type { VisaWithStats } from "../lib/repositories/visa.repository";

// Mock Data
const mockVisa: VisaWithStats = {
  id: "1",
  subclass: "500",
  name: "Student Visa",
  country: "Australia",
  category: "student",
  official_url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
  summary: "For students",
  description: "Study in Australia",
  cost_aud: "650",
  processing_time_range: "1-3 months",
  duration: "Up to 5 years",
  key_requirements: "Enrolment, English, Funds",
  processing_fee_description: "From AUD 650",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  tracker_stats: {
    visa_id: "1",
    weighted_avg_days: 45,
    ewma_days: 42,
    median_days: 40,
    p25_days: 30,
    p75_days: 60,
    total_entries: 100,
    last_updated: new Date().toISOString(),
  },
  visa_requirements: null,
};

// Mock visaService
const mockGetVisas = mock(async () => {
    // Simulate slight delay
    await new Promise(resolve => setTimeout(resolve, 10));
    return { visas: [mockVisa], total: 1 };
});

mock.module("../lib/services/visa.service", () => ({
  visaService: {
    getVisas: mockGetVisas,
  },
}));

describe("useVisas", () => {
  beforeEach(() => {
    mockGetVisas.mockClear();
    // Reset implementation to default success
    mockGetVisas.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return { visas: [mockVisa], total: 1 };
    });
  });

  test("should initialize with loading state", async () => {
    const { result } = renderHook(() => useVisas());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.visas).toEqual([]);

    // Wait for update
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.visas).toEqual([mockVisa]);
    expect(result.current.total).toBe(1);
    expect(result.current.error).toBeNull();
  });

  test("should call getVisas with default parameters when no args provided", async () => {
    const { result } = renderHook(() => useVisas());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetVisas).toHaveBeenCalledTimes(1);
    expect(mockGetVisas).toHaveBeenCalledWith({
      search: "",
      country: "",
      category: "",
      page: 1,
      pageSize: 10,
    });
  });

  test("should call getVisas with string arguments (legacy signature)", async () => {
    const { result } = renderHook(() => useVisas("search_term", "Canada", "work"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetVisas).toHaveBeenCalledWith({
      search: "search_term",
      country: "Canada",
      category: "work",
      page: 1,
      pageSize: 10,
    });
  });

  test("should call getVisas with object filters", async () => {
    const filters = {
      search: "engineer",
      country: "UK",
      category: "family",
      page: 2,
      pageSize: 20,
    };

    const { result } = renderHook(() => useVisas(filters));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetVisas).toHaveBeenCalledWith(filters);
  });

  test("should handle partial object filters with defaults", async () => {
    const filters = {
      search: "doctor",
    };

    // Cast to any to bypass TS check if testing runtime behavior, or assume optional props
    const { result } = renderHook(() => useVisas(filters));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetVisas).toHaveBeenCalledWith({
      search: "doctor",
      country: "",
      category: "",
      page: 1,
      pageSize: 10,
    });
  });

  test("should handle error state", async () => {
    const mockError = new Error("Network error");
    mockGetVisas.mockImplementation(() => Promise.reject(mockError));

    const { result } = renderHook(() => useVisas());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeDefined();
    expect(result.current.visas).toEqual([]);
    expect(result.current.total).toBe(0);
  });
});
