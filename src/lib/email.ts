// ========================================
// EMAIL SERVICE
// Handles sending assessment reports
// ========================================

import { APP_CONFIG } from '../config/app.config';
import type { DetailedResult, GatewayResult } from '../types/assessment';

interface EmailReportData {
  email: string;
  gatewayResult?: GatewayResult;
  detailedResult: DetailedResult;
  timestamp: Date;
}

// Generate HTML email template
export const generateEmailHTML = (data: EmailReportData): string => {
  const { detailedResult, timestamp } = data;
  
  const riskColor = 
    detailedResult.riskScore >= 90 ? '#10b981' :
    detailedResult.riskScore >= 75 ? '#22c55e' :
    detailedResult.riskScore >= 60 ? '#eab308' :
    detailedResult.riskScore >= 40 ? '#f97316' : '#ef4444';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your NZ Business Investor Visa Assessment</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0369a1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .score-box { background: #f9fafb; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
    .score { font-size: 48px; font-weight: bold; color: ${riskColor}; }
    .section { margin: 25px 0; }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #111827; }
    .item { margin: 8px 0; padding-left: 20px; }
    .strength { color: #10b981; }
    .concern { color: #f97316; }
    .recommendation { color: #3b82f6; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
    .disclaimer { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>NZ Business Investor Visa Assessment</h1>
    <p>Your Personalized Assessment Report</p>
  </div>
  
  <div class="content">
    <p>Dear Applicant,</p>
    <p>Thank you for completing the Business Investor Visa assessment. Here are your results:</p>
    
    <div class="score-box">
      <div class="score">${detailedResult.riskScore}/100</div>
      <p style="font-size: 18px; margin: 10px 0;">
        ${detailedResult.riskScore >= 90 ? 'Excellent' : 
          detailedResult.riskScore >= 75 ? 'Strong' :
          detailedResult.riskScore >= 60 ? 'Moderate' :
          detailedResult.riskScore >= 40 ? 'Weak' : 'High Risk'}
      </p>
      <p style="color: #6b7280;">
        ${detailedResult.pathway === 'fast_track' ? 'Recommended: Fast Track (12 months to residence)' :
          detailedResult.pathway === 'standard' ? 'Recommended: Standard (3 years to residence)' :
          'Not currently eligible'}
      </p>
    </div>

    ${detailedResult.strengths.length > 0 ? `
    <div class="section">
      <div class="section-title">✓ Your Strengths</div>
      ${detailedResult.strengths.map(s => `<div class="item strength">• ${s}</div>`).join('')}
    </div>
    ` : ''}

    ${detailedResult.concerns.length > 0 ? `
    <div class="section">
      <div class="section-title">⚠ Areas of Concern</div>
      ${detailedResult.concerns.map(c => `<div class="item concern">• ${c}</div>`).join('')}
    </div>
    ` : ''}

    ${detailedResult.recommendations.length > 0 ? `
    <div class="section">
      <div class="section-title">→ Our Recommendations</div>
      ${detailedResult.recommendations.map(r => `<div class="item recommendation">• ${r}</div>`).join('')}
    </div>
    ` : ''}

    <div class="disclaimer">
      <strong>Important Disclaimer:</strong> ${APP_CONFIG.disclaimers.full}
    </div>

    <p style="margin-top: 30px;">
      <strong>Next Steps:</strong><br>
      • Review this assessment carefully<br>
      • Prepare documentation based on recommendations<br>
      • Contact us for professional consultation
    </p>

    <p style="text-align: center; margin-top: 30px;">
      <a href="mailto:${APP_CONFIG.supportEmail}" style="background: #0369a1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Contact Us for Consultation
      </a>
    </p>
  </div>

  <div class="footer">
    <p><strong>${APP_CONFIG.firmName}</strong></p>
    <p>${APP_CONFIG.supportEmail}</p>
    <p style="margin-top: 15px;">
      Assessment completed: ${timestamp.toLocaleDateString('en-NZ', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </p>
    <p style="margin-top: 15px; font-size: 11px;">
      © ${new Date().getFullYear()} ${APP_CONFIG.firmName}. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
};

// Plain text version (fallback)
export const generateEmailText = (data: EmailReportData): string => {
  const { detailedResult, timestamp } = data;
  
  return `
NZ BUSINESS INVESTOR VISA ASSESSMENT REPORT

Your Assessment Score: ${detailedResult.riskScore}/100
Rating: ${
  detailedResult.riskScore >= 90 ? 'Excellent' : 
  detailedResult.riskScore >= 75 ? 'Strong' :
  detailedResult.riskScore >= 60 ? 'Moderate' :
  detailedResult.riskScore >= 40 ? 'Weak' : 'High Risk'
}

Recommended Pathway: ${
  detailedResult.pathway === 'fast_track' ? 'Fast Track (12 months to residence)' :
  detailedResult.pathway === 'standard' ? 'Standard (3 years to residence)' :
  'Not currently eligible'
}

${detailedResult.strengths.length > 0 ? `
STRENGTHS:
${detailedResult.strengths.map(s => `• ${s}`).join('\n')}
` : ''}

${detailedResult.concerns.length > 0 ? `
CONCERNS:
${detailedResult.concerns.map(c => `• ${c}`).join('\n')}
` : ''}

${detailedResult.recommendations.length > 0 ? `
RECOMMENDATIONS:
${detailedResult.recommendations.map(r => `• ${r}`).join('\n')}
` : ''}

DISCLAIMER:
${APP_CONFIG.disclaimers.full}

---
${APP_CONFIG.firmName}
${APP_CONFIG.supportEmail}
Assessment completed: ${timestamp.toLocaleString('en-NZ')}
  `.trim();
};

// Send email (via serverless function to avoid CORS)
export const sendAssessmentEmail = async (data: EmailReportData): Promise<boolean> => {
  if (!APP_CONFIG.email.enabled) {
    console.log('📧 Email sending disabled in config');
    return false;
  }

  try {
    const emailPayload = {
      email: data.email,
      html: generateEmailHTML(data),
      text: generateEmailText(data),
    };

    console.log('📧 Sending email via API...');
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API error:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ Email sent successfully!', result);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    // Fallback: Log email for manual sending
    console.log('📧 EMAIL REPORT (manual fallback):');
    console.log('To:', data.email);
    console.log('Subject: Your NZ Business Investor Visa Assessment Results');
    console.log('---');
    console.log(generateEmailHTML(data));
    
    return false;
  }
};

export default {
  generateEmailHTML,
  generateEmailText,
  sendAssessmentEmail,
};