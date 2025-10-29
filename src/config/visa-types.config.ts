// ========================================
// VISA TYPES CONFIGURATION
// Easy to add new visa types
// ========================================

export interface VisaType {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  minInvestment?: number;
  estimatedProcessingTime?: string;
}

export const VISA_TYPES: Record<string, VisaType> = {
  businessInvestor: {
    id: 'business-investor',
    name: 'Business Investor Visa',
    description: 'Purchase and operate an existing NZ business ($1M-$2M)',
    enabled: true,
    minInvestment: 1000000,
    estimatedProcessingTime: '3-6 months',
  },
  
  // Future visa types (disabled for now)
  entrepreneur: {
    id: 'entrepreneur',
    name: 'Entrepreneur Residence Visa',
    description: 'Establish or buy a business in NZ',
    enabled: false,
    minInvestment: 500000,
    estimatedProcessingTime: '4-8 months',
  },
  
  skilledMigrant: {
    id: 'skilled-migrant',
    name: 'Skilled Migrant Category',
    description: 'Residence for skilled workers',
    enabled: false,
    estimatedProcessingTime: '6-12 months',
  },
};

// Get only enabled visa types
export const getEnabledVisaTypes = (): VisaType[] => {
  return Object.values(VISA_TYPES).filter(visa => visa.enabled);
};

// Get specific visa type
export const getVisaType = (id: string): VisaType | undefined => {
  return Object.values(VISA_TYPES).find(visa => visa.id === id);
};

export default VISA_TYPES;