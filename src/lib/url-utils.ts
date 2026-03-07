// Utility functions for URL handling

/**
 * Convert visa name to URL-friendly slug
 * e.g., "Partner Visa" -> "partner-visa"
 * e.g., "Subclass 820/801" -> "partner-visa-820-801"
 */
export function createVisaSlug(name: string, subclass?: string): string {
  // If we have a subclass, use it for uniqueness
  if (subclass) {
    const cleanSubclass = subclass.replace(/\//g, '-').replace(/\s/g, '');
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    return `${cleanName}-${cleanSubclass}`;
  }
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Create a full visa URL
 */
export function getVisaUrl(visa: { name: string; subclass: string; isPremium?: boolean }): string {
  const slug = createVisaSlug(visa.name, visa.subclass);
  
  // If premium, go to premium page
  if (visa.isPremium) {
    return `/visas/${slug}/premium`;
  }
  
  return `/visas/${slug}`;
}

/**
 * Extract subclass from slug for API calls
 * e.g., "partner-visa-820-801" -> "820/801"
 */
export function extractSubclassFromSlug(slug: string): string {
  // Try to find subclass pattern (numbers with optional dashes)
  const match = slug.match(/(\d{2,3})-(\d{2,3})/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  
  // Single subclass
  const singleMatch = slug.match(/(\d{3})$/);
  if (singleMatch) {
    return singleMatch[1];
  }
  
  return slug;
}

/**
 * Common visa slugs for popular visas
 */
export const VISA_SLUGS: Record<string, { slug: string; name: string }> = {
  '820/801': { slug: 'partner-visa-820-801', name: 'Partner Visa' },
  '309/100': { slug: 'partner-visa-309-100', name: 'Partner Visa (Offshore)' },
  '300': { slug: 'prospective-marriage-visa-300', name: 'Prospective Marriage Visa' },
  '189': { slug: 'skilled-independent-visa-189', name: 'Skilled Independent Visa' },
  '190': { slug: 'skilled-nominated-visa-190', name: 'Skilled Nominated Visa' },
  '491': { slug: 'skilled-work-regional-visa-491', name: 'Skilled Work Regional Visa' },
  '500': { slug: 'student-visa-500', name: 'Student Visa' },
  '485': { slug: 'temporary-graduate-visa-485', name: 'Temporary Graduate Visa' },
  '600': { slug: 'visitor-visa-600', name: 'Visitor Visa' },
  '186': { slug: 'employer-nomination-visa-186', name: 'Employer Nomination Visa' },
  '482': { slug: 'temporary-skill-shortage-visa-482', name: 'Temporary Skill Shortage Visa' },
};

/**
 * Get visa by slug
 */
export function getVisaBySlug(slug: string): { subclass: string; name: string } | null {
  const entry = Object.entries(VISA_SLUGS).find(([_, data]) => data.slug === slug);
  if (entry) {
    return { subclass: entry[0], name: entry[1].name };
  }
  return null;
}
