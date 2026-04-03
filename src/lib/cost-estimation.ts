import { differenceInWeeks } from 'date-fns';
import type { CostEstimate } from '@/lib/types/criteria';

const AVG_WEEKS_PER_MONTH = 4.33;
const DEFAULT_ORT_PERCENTAGE = 0.15; // 15% average ORT estimate

export function estimateCost(params: {
  hourlyRate: number;
  hoursPerWeek: number;
  startDate: string;
  endDate: string;
  ortPercentage?: number;
}): CostEstimate {
  const { hourlyRate, hoursPerWeek, startDate, endDate, ortPercentage = DEFAULT_ORT_PERCENTAGE } = params;

  const weeks = Math.max(1, differenceInWeeks(new Date(endDate), new Date(startDate)));
  const monthlyBase = hourlyRate * hoursPerWeek * AVG_WEEKS_PER_MONTH;
  const totalBase = hourlyRate * hoursPerWeek * weeks;
  const estimatedOrt = totalBase * ortPercentage;
  const grandTotal = totalBase + estimatedOrt;

  return {
    hourlyRate,
    hoursPerWeek,
    weeksInPeriod: weeks,
    monthlyBase: Math.round(monthlyBase * 100) / 100,
    totalBase: Math.round(totalBase * 100) / 100,
    estimatedOrt: Math.round(estimatedOrt * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}
