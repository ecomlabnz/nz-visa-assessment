// ========================================
// TYPESCRIPT TYPES
// Type definitions for the entire app
// ========================================

export type QuestionType = 'yes-no' | 'number' | 'select' | 'text';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface AssessmentAnswers {
  [key: string]: any;
}

export interface GatewayResult {
  eligible: boolean;
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'MARGINAL';
  passedChecks: number;
  totalChecks: number;
  failedCriteria: string[];
}

export interface DetailedResult {
  eligibilityScore: number;
  riskScore: number;
  pathway: 'standard' | 'fast_track' | 'ineligible';
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

export interface AssessmentData {
  visaType: string;
  gatewayAnswers?: AssessmentAnswers;
  detailedAnswers?: AssessmentAnswers;
  gatewayResult?: GatewayResult;
  detailedResult?: DetailedResult;
  completedAt?: Date;
  email?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface RiskBand {
  label: string;
  color: string;
  description: string;
}