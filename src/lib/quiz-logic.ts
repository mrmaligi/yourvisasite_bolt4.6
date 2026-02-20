export interface QuizAnswers {
  email: string;
  current_country: string;
  visa_purpose: string[];
  has_job_offer: boolean;
  has_family_sponsor: boolean;
  english_level: string;
  education_level: string;
  work_experience_years: number;
  age_range: string;
}

export interface Recommendation {
  visa_id: string;
  visa_name: string;
  eligibility_score: number;
  reasons: string[];
}

export const generateRecommendations = (answers: QuizAnswers): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Work visa recommendations
  if (answers.visa_purpose.includes('work')) {
    if (answers.has_job_offer) {
      recommendations.push({
        visa_id: '482',
        visa_name: 'Temporary Skill Shortage (TSS) visa (Subclass 482)',
        eligibility_score: 95,
        reasons: ['You have a job offer', 'This is the primary employer-sponsored visa'],
      });
    }

    if (answers.work_experience_years >= 3 && answers.english_level !== 'none') {
      recommendations.push({
        visa_id: '189',
        visa_name: 'Skilled Independent visa (Subclass 189)',
        eligibility_score: answers.has_job_offer ? 70 : 85,
        reasons: [
          `${answers.work_experience_years}+ years work experience`,
          'Points-based visa, no sponsor required',
        ],
      });
    }

    if (answers.education_level === 'phd' || answers.education_level === 'masters') {
      recommendations.push({
        visa_id: '485',
        visa_name: 'Temporary Graduate visa (Subclass 485)',
        eligibility_score: 90,
        reasons: ['High education level qualifies for graduate visa', 'Pathway to permanent residency'],
      });
    }
  }

  // Family visa recommendations
  if (answers.visa_purpose.includes('family') && answers.has_family_sponsor) {
    recommendations.push({
      visa_id: '820',
      visa_name: 'Partner visa (Subclass 820/801)',
      eligibility_score: 95,
      reasons: ['You have an eligible family sponsor', 'Direct pathway to permanent residency'],
    });
  }

  // Student visa
  if (answers.visa_purpose.includes('study')) {
    recommendations.push({
      visa_id: '500',
      visa_name: 'Student visa (Subclass 500)',
      eligibility_score: 90,
      reasons: ['Straightforward pathway for students', 'Work rights included'],
    });
  }

  // Working Holiday (young applicants)
  if (answers.age_range === '18-24' || answers.age_range === '25-32') {
    if (!answers.visa_purpose.includes('family')) {
      recommendations.push({
        visa_id: '417',
        visa_name: 'Working Holiday visa (Subclass 417)',
        eligibility_score: 95,
        reasons: ['Age eligible', 'Great for short-term work and travel'],
      });
    }
  }

  // Sort by eligibility score
  return recommendations.sort((a, b) => b.eligibility_score - a.eligibility_score);
};
