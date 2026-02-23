import type { Profile, LawyerProfile } from '../types/database';

export const USE_MOCK = true;

// Mock Users (Applicants)
export const MOCK_USERS: Profile[] = Array.from({ length: 10 }, (_, i) => ({
  id: `user-${i + 1}`,
  role: 'user',
  full_name: `User ${i + 1}`,
  avatar_url: `https://i.pravatar.cc/150?u=user-${i + 1}`,
  phone: `+1555010${i}`,
  is_active: true,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

// Mock Admins
export const MOCK_ADMINS: Profile[] = Array.from({ length: 10 }, (_, i) => ({
  id: `admin-${i + 1}`,
  role: 'admin',
  full_name: `Admin ${i + 1}`,
  avatar_url: `https://i.pravatar.cc/150?u=admin-${i + 1}`,
  phone: `+1555020${i}`,
  is_active: true,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

// Mock Lawyers (Base Profiles)
export const MOCK_LAWYER_USERS: Profile[] = Array.from({ length: 10 }, (_, i) => ({
  id: `lawyer-user-${i + 1}`,
  role: 'lawyer',
  full_name: `Lawyer ${i + 1}`,
  avatar_url: `https://i.pravatar.cc/150?u=lawyer-${i + 1}`,
  phone: `+1555030${i}`,
  is_active: true,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

// Mock Lawyer Profiles (Detailed)
export const MOCK_LAWYER_PROFILES: LawyerProfile[] = MOCK_LAWYER_USERS.map((user, i) => ({
  id: `lawyer-profile-${i + 1}`,
  profile_id: user.id,
  bar_number: `BAR-${1000 + i}`,
  jurisdiction: ['New York', 'California', 'Texas', 'Florida'][i % 4],
  practice_areas: ['Family', 'Business', 'Asylum', 'Deportation Defense'].slice(0, (i % 3) + 1),
  years_experience: 5 + i,
  bio: `Experienced immigration lawyer specializing in ${['Family', 'Business', 'Asylum'][i % 3]} law. Committed to helping clients navigate complex visa processes.`,
  hourly_rate_cents: (200 + i * 25) * 100,
  is_verified: true,
  verification_status: 'approved',
  verification_document_url: `https://example.com/doc-${i + 1}.pdf`,
  rejection_reason: null,
  verified_at: new Date().toISOString(),
  verified_by: 'admin-1',
  created_at: user.created_at,
  updated_at: user.updated_at,
}));

// Combined Lawyer List Item (for Directory)
export const MOCK_LAWYER_DIRECTORY_ITEMS = MOCK_LAWYER_PROFILES.map((profile, i) => {
  const user = MOCK_LAWYER_USERS.find(u => u.id === profile.profile_id)!;
  return {
    ...profile,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    slot_count: 5 + (i % 3), // Mock open slots
  };
});

// Helper to get all profiles
export const ALL_MOCK_PROFILES = [...MOCK_USERS, ...MOCK_ADMINS, ...MOCK_LAWYER_USERS];
