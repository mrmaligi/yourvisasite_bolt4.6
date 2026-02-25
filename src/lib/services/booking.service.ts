import { BookingRepository } from '../repositories/booking.repository';
import { errorHandler } from '../errors/handler';
import type { Booking, UserRole, LawyerProfile, Profile } from '../../types/database';

export interface BookingWithDetails extends Booking {
  lawyer_name?: string | null;
  lawyer_jurisdiction?: string;
  user_name?: string | null;
  user_phone?: string | null;
}

export class BookingService {
  private repository: BookingRepository;

  constructor(repository?: BookingRepository) {
    this.repository = repository || new BookingRepository();
  }

  async getBookings(userId: string, role: UserRole): Promise<BookingWithDetails[]> {
    try {
      let bookings: Booking[] = [];

      if (role === 'lawyer') {
        const { data: lawyerProfile, error } = await this.repository.findLawyerByProfileId(userId);
        if (error) throw error;
        if (!lawyerProfile) return [];

        const { data, error: bookingError } = await this.repository.findByLawyerId(lawyerProfile.id);
        if (bookingError) throw bookingError;
        bookings = data;
      } else {
        const { data, error } = await this.repository.findByUserId(userId);
        if (error) throw error;
        bookings = data;
      }

      if (bookings.length === 0) return [];

      return await this.enrichBookings(bookings, role);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  private async enrichBookings(bookings: Booking[], role: UserRole): Promise<BookingWithDetails[]> {
    const lawyerIds = [...new Set(bookings.map(b => b.lawyer_id))];
    const userIds = [...new Set(bookings.map(b => b.user_id))];

    // Parallel fetching
    const [lawyerProfilesResult, userProfilesResult] = await Promise.all([
        role === 'user' ? this.repository.findLawyerProfiles(lawyerIds) : Promise.resolve({ data: [] as LawyerProfile[], error: null }),
        role === 'lawyer' ? this.repository.findProfiles(userIds) : Promise.resolve({ data: [] as Profile[], error: null })
    ]);

    if (lawyerProfilesResult.error) throw lawyerProfilesResult.error;
    if (userProfilesResult.error) throw userProfilesResult.error;

    const lawyerProfilesData = lawyerProfilesResult.data || [];
    const userProfilesData = userProfilesResult.data || [];

    // For lawyers, we need public profile names to display to users
    let publicProfileMap = new Map<string, string | null>();
    if (role === 'user' && lawyerProfilesData.length > 0) {
        const userIds = lawyerProfilesData.map(lp => lp.user_id);
        const { data: profiles, error } = await this.repository.findProfiles(userIds);
        if (error) throw error;
        if (profiles) {
            profiles.forEach(p => publicProfileMap.set(p.id, p.full_name));
        }
    }

    // Map lawyer ID -> { name, jurisdiction }
    const lawyerInfoMap = new Map();
    lawyerProfilesData.forEach(lp => {
        lawyerInfoMap.set(lp.id, {
            name: publicProfileMap.get(lp.user_id),
            jurisdiction: lp.jurisdiction
        });
    });

    const userMap = new Map(userProfilesData.map(p => [p.id, { name: p.full_name, phone: p.phone }]));

    const enriched: BookingWithDetails[] = bookings.map(b => {
      const lawyerInfo = role === 'user' ? lawyerInfoMap.get(b.lawyer_id) : undefined;
      const userInfo = role === 'lawyer' ? userMap.get(b.user_id) : undefined;

      return {
        ...b,
        lawyer_name: lawyerInfo?.name,
        lawyer_jurisdiction: lawyerInfo?.jurisdiction,
        user_name: userInfo?.name,
        user_phone: userInfo?.phone,
      };
    });

    return enriched.sort((a, b) => {
       const dateA = new Date(a.scheduled_at).getTime();
       const dateB = new Date(b.scheduled_at).getTime();
       return dateB - dateA;
    });
  }
}

export const bookingService = new BookingService();
