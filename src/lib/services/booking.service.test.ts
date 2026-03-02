import { expect, test, describe, beforeEach, mock } from "bun:test";
import { BookingService } from "./booking.service";
import { BookingRepository } from "../repositories/booking.repository";

// Mock supabase to avoid environment variable errors
mock.module("../supabase", () => ({
  supabase: {},
  fetchWithRetry: mock((fn) => fn())
}));

// Mock data
const mockBooking = {
  id: "1",
  user_id: "user1",
  lawyer_id: "lawyer1",
  slot_id: "slot1",
  status: "confirmed",
  scheduled_at: "2023-10-10T10:00:00Z",
  booking_date: "2023-10-01",
  start_time: "10:00",
  end_time: "11:00",
  questions: "Help me",
  created_at: "2023-10-01T09:00:00Z",
  updated_at: "2023-10-01T09:00:00Z"
};

const mockLawyerProfile = {
  id: "lawyer1",
  user_id: "user_lawyer1",
  profile_id: "user_lawyer1", // Assuming profile_id matches user_id for simplicity or as expected
  jurisdiction: "NSW",
  verification_status: "approved",
  specializations: ["visa"],
  hourly_rate: 100,
  years_experience: 5,
  biography: "Bio",
  languages: ["English"],
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z"
};

const mockUserProfile = {
  id: "user1",
  full_name: "Test User",
  phone: "1234567890",
  email: "test@example.com",
  role: "user",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z"
};

const mockLawyerUserProfile = {
  id: "user_lawyer1",
  full_name: "Test Lawyer",
  phone: "0987654321",
  email: "lawyer@example.com",
  role: "lawyer",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z"
};

describe("BookingService", () => {
  let service: BookingService;
  let mockRepo: BookingRepository;

  beforeEach(() => {
    // Create a mock repository with mocked methods
    mockRepo = {
      findByUserId: mock(() => Promise.resolve({ data: [], error: null })),
      findByLawyerId: mock(() => Promise.resolve({ data: [], error: null })),
      findLawyerByProfileId: mock(() => Promise.resolve({ data: null, error: null })),
      findLawyerProfiles: mock(() => Promise.resolve({ data: [], error: null })),
      findProfiles: mock(() => Promise.resolve({ data: [], error: null }))
    } as unknown as BookingRepository;

    service = new BookingService(mockRepo);
  });

  test("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getBookings for User", () => {
    test("should return enriched bookings for user", async () => {
      // Mock repository responses
      (mockRepo.findByUserId as any).mockResolvedValue({ data: [mockBooking], error: null });
      (mockRepo.findLawyerProfiles as any).mockResolvedValue({ data: [mockLawyerProfile], error: null });
      (mockRepo.findProfiles as any).mockResolvedValue({ data: [mockLawyerUserProfile], error: null });

      const result = await service.getBookings("user1", "user");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
      expect(result[0].lawyer_name).toBe("Test Lawyer");
      expect(result[0].lawyer_jurisdiction).toBe("NSW");
      expect(mockRepo.findByUserId).toHaveBeenCalledWith("user1");
      expect(mockRepo.findLawyerProfiles).toHaveBeenCalledWith(["lawyer1"]);
    });

    test("should handle empty bookings for user", async () => {
      (mockRepo.findByUserId as any).mockResolvedValue({ data: [], error: null });

      const result = await service.getBookings("user1", "user");

      expect(result).toHaveLength(0);
      expect(mockRepo.findByUserId).toHaveBeenCalledWith("user1");
      expect(mockRepo.findLawyerProfiles).not.toHaveBeenCalled();
    });

    test("should handle error when fetching bookings for user", async () => {
      const error = new Error("Database error");
      (mockRepo.findByUserId as any).mockResolvedValue({ data: null, error });

      try {
        await service.getBookings("user1", "user");
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });
  });

  describe("getBookings for Lawyer", () => {
    test("should return enriched bookings for lawyer", async () => {
      (mockRepo.findLawyerByProfileId as any).mockResolvedValue({ data: mockLawyerProfile, error: null });
      (mockRepo.findByLawyerId as any).mockResolvedValue({ data: [mockBooking], error: null });
      (mockRepo.findProfiles as any).mockResolvedValue({ data: [mockUserProfile], error: null });

      const result = await service.getBookings("user_lawyer1", "lawyer");

      expect(result).toHaveLength(1);
      expect(result[0].user_name).toBe("Test User");
      expect(result[0].user_phone).toBe("1234567890");
      expect(mockRepo.findLawyerByProfileId).toHaveBeenCalledWith("user_lawyer1");
      expect(mockRepo.findByLawyerId).toHaveBeenCalledWith("lawyer1");
    });

    test("should return empty if lawyer profile not found", async () => {
      (mockRepo.findLawyerByProfileId as any).mockResolvedValue({ data: null, error: null });

      const result = await service.getBookings("user_lawyer1", "lawyer");

      expect(result).toHaveLength(0);
      expect(mockRepo.findByLawyerId).not.toHaveBeenCalled();
    });

    test("should handle empty bookings for lawyer", async () => {
      (mockRepo.findLawyerByProfileId as any).mockResolvedValue({ data: mockLawyerProfile, error: null });
      (mockRepo.findByLawyerId as any).mockResolvedValue({ data: [], error: null });

      const result = await service.getBookings("user_lawyer1", "lawyer");

      expect(result).toHaveLength(0);
      expect(mockRepo.findByLawyerId).toHaveBeenCalledWith("lawyer1");
      expect(mockRepo.findProfiles).not.toHaveBeenCalled();
    });

    test("should handle error when fetching lawyer profile", async () => {
      const error = new Error("Profile error");
      (mockRepo.findLawyerByProfileId as any).mockResolvedValue({ data: null, error });

      try {
        await service.getBookings("user_lawyer1", "lawyer");
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });
  });
});
