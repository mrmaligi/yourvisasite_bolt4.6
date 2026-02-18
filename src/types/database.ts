export type UserRole = 'user' | 'lawyer' | 'admin';
export type VisaCategory = 'work' | 'family' | 'student' | 'visitor' | 'humanitarian' | 'business' | 'other';
export type TrackerOutcome = 'approved' | 'refused' | 'withdrawn' | 'pending';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface YouTubeFeed {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string | null;
  channel_name: string;
  visa_id: string | null;
  created_at: string;
}

export interface Visa {
  id: string;
  subclass: string;
  name: string;
  country: string;
  category: string;
  official_link: string | null;
  summary: string | null;
  description: string | null;
  base_cost_aud: number | null;
  cost_aud: string | null;
  processing_time_range: string | null;
  duration: string | null;
  key_requirements: string | null;
  processing_fee_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentCategory {
  id: string;
  key: string;
  name: string;
  description: string | null;
  tips: string | null;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Premium content for a visa, organized by sections/steps
export interface VisaPremiumContent {
  id: string;
  visa_id: string;
  step_number: number;
  title: string;
  body: string;
  document_category: string | null;
  document_explanation: string | null;
  document_example_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisaRequirement {
  id: string;
  visa_id: string;
  requirements_json: Record<string, unknown>;
  updated_at: string;
}

export interface TrackerEntry {
  id: string;
  visa_id: string;
  submitted_by: string | null;
  submitter_role: UserRole | null;
  application_date: string;
  decision_date: string | null;
  processing_days: number | null;
  outcome: TrackerOutcome;
  weight: number;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface TrackerStats {
  visa_id: string;
  weighted_avg_days: number | null;
  ewma_days: number | null;
  median_days: number | null;
  p25_days: number | null;
  p75_days: number | null;
  total_entries: number;
  last_updated: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  image_url: string | null;
  author_id: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsComment {
  id: string;
  article_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  visa_id: string;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  price_cents: number;
  is_active: boolean;
  updated_at: string;
}

export interface LawyerProfile {
  id: string;
  profile_id: string;
  bar_number: string;
  jurisdiction: string;
  practice_areas: string[];
  years_experience: number;
  bio: string | null;
  hourly_rate_cents: number | null;
  is_verified: boolean;
  verification_status: VerificationStatus;
  verification_document_url: string | null;
  rejection_reason: string | null;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultationSlot {
  id: string;
  lawyer_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  is_reserved: boolean;
  reserved_until: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  lawyer_id: string;
  slot_id: string;
  duration_minutes: number;
  total_price_cents: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  file_takeover_status: 'requested' | 'accepted' | 'rejected' | null;
  confirmed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserVisaPurchase {
  id: string;
  user_id: string;
  visa_id: string;
  amount_cents: number;
  payment_provider: string;
  payment_id: string | null;
  purchased_at: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  visa_id: string | null;
  document_category: string; // matches DocumentCategory.key
  file_name: string;
  storage_path: string;
  status: DocumentStatus;
  uploaded_at: string;
}

export interface DocumentShare {
  id: string;
  document_id: string;
  lawyer_id: string;
  shared_at: string;
  revoked_at: string | null;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface TrackerSummary extends Visa {
  tracker_stats: TrackerStats | null;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_booking_confirmation: boolean;
  email_booking_reminder: boolean;
  email_consultation_cancelled: boolean;
  email_processing_time_alert: boolean;
  email_welcome: boolean;
  email_premium_purchase: boolean;
  email_marketing: boolean;
  push_booking_reminder: boolean;
  push_processing_time_alert: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  sender_role: UserRole;
  message_text: string;
  is_read: boolean;
  created_at: string;
}
