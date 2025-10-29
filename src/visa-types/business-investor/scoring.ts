// ========================================
// BUSINESS INVESTOR VISA - SCORING LOGIC
// All calculations in one place
// Easy to adjust scoring rules
// ========================================

export interface GatewayResult {
  eligible: boolean;
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'MARGINAL';
  passedChecks: number;
  totalChecks: number;
  failedCriteria: string[];
}

export interface DetailedResult {
  eligibilityScore: number; // 0-100
  riskScore: number; // 0-100 (higher is better)
  pathway: 'standard' | 'fast_track' | 'ineligible';
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

// ========================================
// GATEWAY TEST SCORING
// All 7 criteria must pass
// ========================================

export const evaluateGateway = (answers: Record<string, any>): GatewayResult => {
  const checks = [
    { key: 'age', name: 'Age requirement (≤55)' },
    { key: 'capital', name: 'Capital requirement ($1M+)' },
    { key: 'reserve', name: 'Reserve funds ($500K+)' },
    { key: 'experience', name: 'Business experience (3+ years)' },
    { key: 'english', name: 'English language' },
    { key: 'bankruptcy', name: 'No bankruptcy/business failure' },
    { key: 'clean_record', name: 'Clean criminal/immigration record' },
  ];

  const failedCriteria: string[] = [];
  let passedChecks = 0;

  checks.forEach(check => {
    const answer = answers[check.key];
    
    // For bankruptcy, YES is a fail (inverted logic)
    const passes = check.key === 'bankruptcy' 
      ? answer === false || answer === 'no'
      : answer === true || answer === 'yes';

    if (passes) {
      passedChecks++;
    } else {
      failedCriteria.push(check.name);
    }
  });

  const totalChecks = checks.length;
  
  let status: 'ELIGIBLE' | 'INELIGIBLE' | 'MARGINAL';
  if (passedChecks === totalChecks) {
    status = 'ELIGIBLE';
  } else if (passedChecks >= totalChecks - 1) {
    status = 'MARGINAL'; // Failed only 1 criterion
  } else {
    status = 'INELIGIBLE';
  }

  return {
    eligible: passedChecks === totalChecks,
    status,
    passedChecks,
    totalChecks,
    failedCriteria,
  };
};

// ========================================
// DETAILED ASSESSMENT SCORING
// Risk-based scoring system
// ========================================

export const evaluateDetailed = (answers: Record<string, any>): DetailedResult => {
  let riskScore = 100; // Start at perfect score
  const strengths: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];

  // Age assessment
  const age = answers.age_exact || 0;
  if (age <= 45) {
    strengths.push('Young applicant (more time to operate business)');
  } else if (age > 50) {
    riskScore -= 5;
    if (age > 53) {
      riskScore -= 10;
      concerns.push('Age close to maximum limit (55)');
      recommendations.push('Apply as soon as possible before reaching age limit');
    }
  }

  // Capital assessment
  const capital = answers.capital_amount || 0;
  if (capital >= 2000000) {
    strengths.push('Qualifies for fast-track pathway (12 months to residence)');
  } else if (capital < 1500000) {
    riskScore -= 5;
    concerns.push('Capital amount close to minimum requirement');
    recommendations.push('Consider increasing investment to $2M for faster pathway');
  }

  // Business experience assessment
  const expType = answers.experience_type;
  const expYears = answers.experience_years || 0;

  if (expType === 'Self-employed (business owner)') {
    strengths.push('Self-employment experience (strong evidence profile)');
  } else if (expType === 'Senior management') {
    riskScore -= 10;
    concerns.push('Senior management experience (more complex to evidence)');
    recommendations.push('Prepare detailed evidence: org charts, job descriptions, authority documentation');
  }

  if (expYears >= 5) {
    strengths.push(`${expYears} years business experience (exceeds minimum)`);
  } else if (expYears === 3) {
    concerns.push('Minimum business experience (3 years)');
  }

  // English language
  const englishMethod = answers.english_method;
  if (!englishMethod || englishMethod === 'IELTS test (5.0 overall)') {
    if (!answers.english_test_date) {
      riskScore -= 15;
      concerns.push('English test not yet taken');
      recommendations.push('Book IELTS test immediately (must be in-person, results valid 2 years)');
    }
  }

  // Business identification and assessment
  const businessIdentified = answers.business_identified;
  if (businessIdentified) {
    const sector = answers.business_sector;
    const employees = answers.business_employees || 0;
    const years = answers.business_years || 0;
    const price = answers.business_price || 0;
    const franchise = answers.business_franchise;

    // Sector risk
    if (sector === 'Retail' || sector === 'Hospitality/Food Service') {
      riskScore -= 15;
      concerns.push('High-risk sector (retail/hospitality) - higher compliance scrutiny');
      recommendations.push('Ensure impeccable employment and tax compliance records');
    } else if (sector === 'Manufacturing' || sector === 'Technology/IT Services' || sector === 'Professional Services') {
      strengths.push('Suitable business sector for visa category');
    }

    // Employee count
    if (employees < 5) {
      riskScore -= 20;
      concerns.push('Business has fewer than 5 employees (does not meet requirement)');
      recommendations.push('Find business with at least 5 full-time employees');
    } else if (employees < 7) {
      riskScore -= 10;
      concerns.push('Employee count close to minimum (5 FTE required)');
    } else {
      strengths.push(`Business has ${employees} employees (exceeds minimum)`);
    }

    // Operating history
    if (years < 5) {
      riskScore -= 20;
      concerns.push('Business operating less than 5 years (does not meet requirement)');
      recommendations.push('Find business that has operated for 5+ years continuously');
    } else if (years < 7) {
      riskScore -= 10;
      concerns.push('Business operating history close to minimum');
    } else {
      strengths.push(`${years} years operating history (exceeds minimum)`);
    }

    // Purchase price
    if (price < 1000000) {
      riskScore -= 20;
      concerns.push('Purchase price below $1M minimum requirement');
    } else if (price < 1200000) {
      riskScore -= 5;
      concerns.push('Purchase price close to minimum');
    }

    // Franchise check (CRITICAL)
    if (franchise === 'Yes - franchise') {
      riskScore -= 50;
      concerns.push('⚠️ CRITICAL: Business is a franchise (EXCLUDED - application will be declined)');
      recommendations.push('Find non-franchise business immediately');
    } else if (franchise === 'Unsure - has some licensing/brand agreements') {
      riskScore -= 25;
      concerns.push('⚠️ Possible franchise indicators (high risk of exclusion)');
      recommendations.push('Obtain legal opinion on whether business meets franchise definition');
      recommendations.push('Review all agreements for: ongoing fees, brand licensing, operational control by third party');
    }

  } else {
    concerns.push('No business identified yet');
    recommendations.push('Begin business search in suitable sectors: manufacturing, professional services, technology');
    recommendations.push('Avoid: franchises, fast food, convenience stores, labour hire, residential-based businesses');
  }

  // Funds location
  const fundsLocation = answers.funds_location;
  if (fundsLocation === 'Outside New Zealand (< 2 years)') {
    concerns.push('Funds outside NZ require detailed tracing documentation');
    recommendations.push('Prepare: bank statements, source documentation, transfer records');
  } else if (fundsLocation === 'In New Zealand') {
    if (!answers.funds_nz_duration_over_2_years) {
      concerns.push('Ensure funds in NZ bank and prepare transfer documentation');
    } else {
      strengths.push('Funds already in NZ (simplified verification)');
    }
  }

  // Compliance checks
  if (answers.bankruptcy_details) {
    riskScore -= 100; // Automatic fail
    concerns.push('⚠️ CRITICAL: Bankruptcy/business failure in last 5 years (INELIGIBLE)');
  }

  if (answers.criminal_record) {
    riskScore -= 50;
    concerns.push('⚠️ Criminal record (requires detailed assessment)');
    recommendations.push('Obtain police certificates and legal opinion on character requirements');
  }

  if (answers.immigration_breaches) {
    riskScore -= 30;
    concerns.push('⚠️ Immigration breaches/refusals (affects character assessment)');
    recommendations.push('Disclose all immigration history fully - non-disclosure is grounds for decline');
  }

  // Timeline assessment
  const timeline = answers.timeline;
  if (timeline === 'Within 1 month' || timeline === '1-3 months') {
    if (!businessIdentified) {
      concerns.push('Tight timeline without business identified');
      recommendations.push('Realistic timeline: 3-6 months for business search + due diligence');
    }
  }

  // Professional advice
  if (!answers.professional_advice) {
    recommendations.push('Obtain professional immigration and legal advice before proceeding');
  }

  // Determine pathway
  let pathway: 'standard' | 'fast_track' | 'ineligible';
  if (riskScore < 40 || answers.bankruptcy_details) {
    pathway = 'ineligible';
  } else if (capital >= 2000000) {
    pathway = 'fast_track';
  } else {
    pathway = 'standard';
  }

  // Calculate final eligibility score (0-100)
  const eligibilityScore = Math.max(0, Math.min(100, riskScore));

  return {
    eligibilityScore,
    riskScore: eligibilityScore,
    pathway,
    strengths,
    concerns,
    recommendations,
  };
};

// ========================================
// RISK BANDS
// For display purposes
// ========================================

export const getRiskBand = (score: number): {
  label: string;
  color: string;
  description: string;
} => {
  if (score >= 90) {
    return {
      label: 'Excellent',
      color: 'text-green-600',
      description: 'Strong application with minimal risk factors',
    };
  } else if (score >= 75) {
    return {
      label: 'Strong',
      color: 'text-green-500',
      description: 'Good application with minor considerations',
    };
  } else if (score >= 60) {
    return {
      label: 'Moderate',
      color: 'text-yellow-600',
      description: 'Viable application but requires attention to risk factors',
    };
  } else if (score >= 40) {
    return {
      label: 'Weak',
      color: 'text-orange-600',
      description: 'Significant challenges - professional advice essential',
    };
  } else {
    return {
      label: 'High Risk',
      color: 'text-red-600',
      description: 'Application likely to be declined - reconsider pathway',
    };
  }
};

export default {
  evaluateGateway,
  evaluateDetailed,
  getRiskBand,
};