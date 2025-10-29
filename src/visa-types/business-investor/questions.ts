// ========================================
// BUSINESS INVESTOR VISA - QUESTIONS
// All questions for gateway and detailed assessment
// Easy to edit, add, or remove questions
// ========================================

export interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'number' | 'select' | 'text';
  required: boolean;
  options?: string[]; // For select type
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// ========================================
// GATEWAY TEST (7 Critical Questions)
// ALL must pass for eligibility
// ========================================

export const GATEWAY_QUESTIONS: Question[] = [
  {
    id: 'age',
    text: 'Are you 55 years old or younger?',
    type: 'yes-no',
    required: true,
    helpText: 'You must be 55 or younger at the time of application',
  },
  {
    id: 'capital',
    text: 'Do you have at least NZ$1 million available for business purchase (excluding real estate and GST)?',
    type: 'yes-no',
    required: true,
    helpText: 'Funds must be legally earned, unencumbered, and verifiable',
  },
  {
    id: 'reserve',
    text: 'Do you have an additional NZ$500,000 in reserve funds or assets?',
    type: 'yes-no',
    required: true,
    helpText: 'Reserve funds must be separate from your investment capital',
  },
  {
    id: 'experience',
    text: 'Do you have at least 3 years of business experience?',
    type: 'yes-no',
    required: true,
    helpText: 'Either as business owner (5+ employees OR $1M+ revenue) OR senior manager (5+ direct reports in $5M+ business)',
  },
  {
    id: 'english',
    text: 'Can you meet the English language requirement (IELTS 5.0 or equivalent)?',
    type: 'yes-no',
    required: true,
    helpText: 'Test must be taken in-person within last 2 years, or citizenship/qualification from approved countries',
  },
  {
    id: 'bankruptcy',
    text: 'Have you been involved in bankruptcy or business failure in the last 5 years?',
    type: 'yes-no',
    required: true,
    helpText: 'Select YES if you have been bankrupt or had business failure. This is a disqualifying factor.',
  },
  {
    id: 'clean_record',
    text: 'Do you have a clean criminal and immigration record?',
    type: 'yes-no',
    required: true,
    helpText: 'No criminal convictions, no immigration breaches',
  },
];

// ========================================
// DETAILED ASSESSMENT QUESTIONS
// For paid assessment after gateway
// ========================================

export const DETAILED_QUESTIONS: Question[] = [
  // Personal Information
  {
    id: 'age_exact',
    text: 'What is your current age?',
    type: 'number',
    required: true,
    validation: { min: 18, max: 55 },
  },
  {
    id: 'nationality',
    text: 'What is your nationality?',
    type: 'text',
    required: true,
  },
  
  // Financial Details
  {
    id: 'capital_amount',
    text: 'Exact amount of capital available for investment (NZD)',
    type: 'number',
    required: true,
    validation: { min: 1000000 },
    helpText: 'Enter amount in NZ dollars, excluding real estate and GST',
  },
  {
    id: 'reserve_amount',
    text: 'Amount of reserve funds available (NZD)',
    type: 'number',
    required: true,
    validation: { min: 500000 },
  },
  {
    id: 'funds_source',
    text: 'Primary source of investment funds',
    type: 'select',
    required: true,
    options: [
      'Business profits',
      'Sale of property',
      'Sale of business',
      'Investment returns',
      'Inheritance',
      'Employment savings',
      'Other',
    ],
  },
  {
    id: 'funds_location',
    text: 'Where are your funds currently held?',
    type: 'select',
    required: true,
    options: [
      'In New Zealand',
      'Outside New Zealand (< 2 years)',
      'Outside New Zealand (> 2 years)',
    ],
    helpText: 'Funds in NZ for 2+ years have simplified verification requirements',
  },
  
  // Business Experience
  {
    id: 'experience_type',
    text: 'Type of business experience',
    type: 'select',
    required: true,
    options: [
      'Self-employed (business owner)',
      'Senior management',
      'Both',
    ],
  },
  {
    id: 'experience_years',
    text: 'Total years of relevant business experience',
    type: 'number',
    required: true,
    validation: { min: 3, max: 50 },
  },
  {
    id: 'business_size',
    text: 'If self-employed: Business size',
    type: 'select',
    required: false,
    options: [
      '5+ full-time employees',
      'Annual revenue $1M+',
      'Both',
      'N/A - I was senior manager',
    ],
  },
  {
    id: 'management_details',
    text: 'If senior manager: Number of direct reports',
    type: 'number',
    required: false,
    validation: { min: 0, max: 1000 },
  },
  {
    id: 'company_turnover',
    text: 'If senior manager: Company annual turnover (NZD)',
    type: 'number',
    required: false,
    validation: { min: 0 },
  },
  
  // English Language
  {
    id: 'english_method',
    text: 'How will you meet English language requirement?',
    type: 'select',
    required: true,
    options: [
      'IELTS test (5.0 overall)',
      'Other approved test',
      'Citizenship (Canada/Ireland/UK/USA)',
      'Qualification from approved country',
    ],
  },
  {
    id: 'english_test_date',
    text: 'If test taken: When? (within last 2 years required)',
    type: 'text',
    required: false,
    helpText: 'Format: MM/YYYY',
  },
  
  // Target Business (if identified)
  {
    id: 'business_identified',
    text: 'Have you identified a specific business to purchase?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'business_sector',
    text: 'If yes: Business sector',
    type: 'select',
    required: false,
    options: [
      'Manufacturing',
      'Technology/IT Services',
      'Professional Services',
      'Healthcare',
      'Construction',
      'Retail',
      'Hospitality/Food Service',
      'Agriculture',
      'Other',
    ],
  },
  {
    id: 'business_price',
    text: 'If yes: Purchase price (NZD)',
    type: 'number',
    required: false,
    validation: { min: 0 },
  },
  {
    id: 'business_employees',
    text: 'If yes: Current number of full-time employees',
    type: 'number',
    required: false,
    validation: { min: 0, max: 1000 },
  },
  {
    id: 'business_years',
    text: 'If yes: How many years has business been operating?',
    type: 'number',
    required: false,
    validation: { min: 0, max: 100 },
  },
  {
    id: 'business_franchise',
    text: 'Is the business a franchise or has franchise-like arrangements?',
    type: 'select',
    required: false,
    options: [
      'No',
      'Yes - franchise',
      'Unsure - has some licensing/brand agreements',
      'N/A - business not identified yet',
    ],
    helpText: 'CRITICAL: Franchises are excluded. Includes any ongoing brand licensing or operational control by third party.',
  },
  
  // Compliance & History
  {
    id: 'bankruptcy_details',
    text: 'Any bankruptcy, business failure, or insolvency in last 5 years?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'criminal_record',
    text: 'Any criminal convictions anywhere in the world?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'immigration_breaches',
    text: 'Any immigration breaches or visa refusals (any country)?',
    type: 'yes-no',
    required: true,
  },
  
  // Timeline & Readiness
  {
    id: 'timeline',
    text: 'When are you planning to apply?',
    type: 'select',
    required: true,
    options: [
      'Within 1 month',
      '1-3 months',
      '3-6 months',
      '6-12 months',
      'Just researching (12+ months)',
    ],
  },
  {
    id: 'visited_nz',
    text: 'Have you visited New Zealand before?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'professional_advice',
    text: 'Have you received professional immigration advice on this pathway?',
    type: 'yes-no',
    required: true,
  },
];

// Combine all questions
export const ALL_QUESTIONS = {
  gateway: GATEWAY_QUESTIONS,
  detailed: DETAILED_QUESTIONS,
};

export default ALL_QUESTIONS;