// Shared types for structured criteria system

export interface RequestCriterion {
  id: string;
  category: 'diploma' | 'registratie' | 'ervaring' | 'apparatuur';
  label: string;
  description?: string;
  required: boolean;
}

export interface CriterionResponse {
  criterionId: string;
  met: boolean;
  notes?: string;
}

export interface CvParsedData {
  diplomas: Array<{
    name: string;
    date?: string;
    institution?: string;
  }>;
  bigRegistration?: {
    number: string;
    status?: string;
  };
  workExperience: Array<{
    role: string;
    organization: string;
    period?: string;
    department?: string;
  }>;
  lastHospital?: string;
  specializations: string[];
  totalYearsExperience?: number;
}

export interface CostEstimate {
  hourlyRate: number;
  hoursPerWeek: number;
  weeksInPeriod: number;
  monthlyBase: number;
  totalBase: number;
  estimatedOrt: number;
  grandTotal: number;
}
