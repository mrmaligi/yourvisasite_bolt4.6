import type { Visa } from '../types/database';

export interface VisaComparisonDetails {
  pros: string[];
  cons: string[];
  pathToPR: string;
  eligibility: string[];
}

const visaComparisonData: Record<string, VisaComparisonDetails> = {
  '189': {
    pros: [
      'Permanent residency from day one',
      'Freedom to live and work anywhere in Australia',
      'No sponsorship required',
      'Can sponsor eligible relatives for permanent residence',
    ],
    cons: [
      'Extremely competitive (high points required)',
      'Limited occupation list (MLTSSL)',
      'High application fee',
      'Long processing times',
    ],
    pathToPR: 'Direct Permanent Residency',
    eligibility: [
      'Must be under 45 years of age',
      'Must have a skills assessment',
      'Must have competent English',
      'Must score at least 65 points (though often higher is needed)',
    ],
  },
  '190': {
    pros: [
      'Permanent residency from day one',
      'State nomination adds 5 points',
      'Wider occupation list than 189',
      'Access to state-specific support',
    ],
    cons: [
      'Must live in nominating state for 2 years',
      'Competitive state nomination process',
      'State requirements vary and change frequently',
    ],
    pathToPR: 'Direct Permanent Residency',
    eligibility: [
      'Must be nominated by an Australian state or territory',
      'Must be under 45 years of age',
      'Must have a skills assessment',
      'Must score at least 65 points (including state points)',
    ],
  },
  '491': {
    pros: [
      'Priority processing',
      'State nomination adds 15 points',
      'Access to regional occupation lists (ROL)',
      'Pathway to PR via 191 visa',
    ],
    cons: [
      'Temporary visa (5 years)',
      'Must live and work in regional area for 3 years',
      'Income threshold requirements for PR',
      'Restricted from applying for other permanent visas for 3 years',
    ],
    pathToPR: 'Pathway to PR (Subclass 191) after 3 years',
    eligibility: [
      'Must be nominated by state or sponsored by eligible relative',
      'Must be under 45 years of age',
      'Must have a skills assessment',
      'Must live in a designated regional area',
    ],
  },
  '482': {
    pros: [
      'No age limit (for the TSS visa itself)',
      'Employer sponsored',
      'Pathway to PR after 2 years with same employer',
      'Can bring family members',
    ],
    cons: [
      'Tied to employer',
      'No direct access to Medicare (unless from reciprocal country)',
      'School fees may apply for children in some states',
      'Temporary residency initially',
    ],
    pathToPR: 'Pathway to PR (Subclass 186) after 2 years',
    eligibility: [
      'Must be nominated by an approved sponsor',
      'Must have 2 years relevant work experience',
      'Must meet English requirements',
      'Must have a relevant occupation on the list',
    ],
  },
  '186': {
    pros: [
      'Permanent residency',
      'Employer sponsored',
      'Available for applicants up to 45 years old',
      'Access to Medicare',
    ],
    cons: [
      'Requires an employer willing to sponsor',
      'Skills assessment required for Direct Entry stream',
      'Employer must pay Skilling Australians Fund levy',
    ],
    pathToPR: 'Direct Permanent Residency',
    eligibility: [
      'Must be nominated by an Australian employer',
      'Must be under 45 years of age',
      'Must have 3 years relevant work experience',
      'Must have competent English',
    ],
  },
  '500': {
    pros: [
      'Study at world-class institutions',
      'Work rights (usually 48 hours per fortnight)',
      'Can bring family members',
      'Pathway to post-study work visas',
    ],
    cons: [
      'Temporary visa',
      'High tuition fees for international students',
      'Work hours restricted',
      'Must maintain health insurance (OSHC)',
    ],
    pathToPR: 'Pathway to PR via skilled migration after studies',
    eligibility: [
      'Must be enrolled in a registered course',
      'Must meet English language requirements',
      'Must show financial capacity',
      'Must have health insurance',
    ],
  },
  '600': {
    pros: [
      'Flexible stay options (3, 6, 12 months)',
      'Can be used for tourism or business visitor activities',
      'Can be applied for onshore or offshore',
    ],
    cons: [
      'No work rights',
      'Cannot access Medicare',
      'Cannot study for more than 3 months',
      'Must prove intent to return home',
    ],
    pathToPR: 'No direct path to PR',
    eligibility: [
      'Must be a genuine visitor',
      'Must have enough funds for stay',
      'Must meet health and character requirements',
    ],
  },
  '820': {
    pros: [
      'Full work rights',
      'Access to Medicare',
      'Pathway to permanent Partner visa (801)',
      'Stay in Australia while processing',
    ],
    cons: [
      'Very high application fee',
      'Long processing times',
      'Two-stage process (temporary then permanent)',
    ],
    pathToPR: 'Pathway to Permanent Partner Visa (801)',
    eligibility: [
      'Must be in a relationship with an Australian citizen or PR',
      'Must be in Australia when applying',
      'Must meet relationship requirements (de facto or married)',
    ],
  },
  '801': {
    pros: [
      'Permanent residency',
      'Work and study anywhere',
      'Sponsor eligible relatives',
      'Apply for citizenship',
    ],
    cons: [
      'Must wait 2 years from 820 application usually',
      'Relationship must still be ongoing',
    ],
    pathToPR: 'Direct Permanent Residency',
    eligibility: [
      'Must hold a subclass 820 visa',
      'Must continue to be in a relationship',
      '2 years must have passed since 820 application',
    ],
  },
};

const defaultDetails: VisaComparisonDetails = {
  pros: ['Opportunity to live in Australia'],
  cons: ['Visa conditions apply'],
  pathToPR: 'Depends on individual circumstances',
  eligibility: ['See official requirements'],
};

export function getVisaComparisonDetails(visa: Visa): VisaComparisonDetails {
  if (!visa || !visa.subclass) {
    return defaultDetails;
  }

  // Try to find by subclass, handling potential variations
  const subclass = visa.subclass.replace(/[^0-9]/g, '');
  return visaComparisonData[subclass] || defaultDetails;
}
