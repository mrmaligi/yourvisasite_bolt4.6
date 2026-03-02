export const WEIGHTS = {
  LAWYER: 10.0,
  USER: 2.0,
  ANONYMOUS: 1.0,
} as const;

export const DEFAULT_VISA_PRICE_CENTS = 4900;

export const TRACKER_THRESHOLDS = {
  FAST_MAX_DAYS: 30,
  MODERATE_MAX_DAYS: 90,
} as const;

export const ROLES = {
  USER: 'user',
  LAWYER: 'lawyer',
  ADMIN: 'admin',
} as const;

export const DOCUMENT_MAX_SIZE_MB = 10;
export const DOCUMENT_ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
