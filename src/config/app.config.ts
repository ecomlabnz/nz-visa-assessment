// ========================================
// MAIN APP CONFIGURATION
// All settings in one place - easy to adjust
// ========================================

export const APP_CONFIG = {
  // App Info
  appName: 'NZ Visa Assessment Tool',
  tagline: 'Find out if you qualify in 5 minutes',
  
  // Contact & Support
  supportEmail: 'support@yoursite.com', // CHANGE THIS
  lawyerName: 'Your Name', // CHANGE THIS
  firmName: 'Your Law Firm', // CHANGE THIS
  
  // Features (toggle on/off)
  features: {
    gatewayTest: true,
    detailedAssessment: true,
    emailReports: true,
    pdfReports: false, // Not implemented yet
    payments: false, // Will enable later with Stripe
    userAccounts: false, // Future feature
  },
  
  // Pricing (USD)
  pricing: {
    gateway: 0, // Free
    basic: 199,
    professional: 499,
    premium: 999,
  },
  
  // Email Settings
  email: {
    enabled: true,
    provider: 'resend',
    fromEmail: 'onboarding@resend.dev', // Resend test email (change to your domain later)
    fromName: 'NZ Visa Assessment',
    resendApiKey: 're_PFwsAu5b_8tUAUboX3f5iaA6GZUPHLGrv', // Your Resend API key
  },
  
  // Stripe Settings (when ready)
  stripe: {
    enabled: false,
    publicKey: '', // Add when ready
    products: {
      basic: '', // Stripe price ID
      professional: '',
      premium: '',
    },
  },
  
  // Legal
  disclaimers: {
    short: 'This assessment provides preliminary guidance only and does not constitute legal advice.',
    full: 'This tool provides preliminary assessment only and does not constitute legal advice. Immigration New Zealand makes final decisions. Results are based on information you provide. We recommend professional legal advice before making investment decisions. No guarantee of visa approval.',
  },
  
  // UI Settings
  ui: {
    showProgressBar: true,
    animationDuration: 200, // milliseconds
    theme: 'professional', // professional | modern | minimal
  },
};

export default APP_CONFIG;