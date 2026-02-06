// ORT (Onregelmatigheidstoeslag) - Irregular Hours Surcharge Calculator
// Dutch healthcare industry standard for shift premiums

export interface OrtRates {
  evening: number;   // 18:00-22:00 (e.g., 1.22 = 22% toeslag)
  night: number;     // 22:00-06:00 (e.g., 1.40 = 40% toeslag)
  weekend: number;   // Saturday & Sunday (e.g., 1.35 = 35% toeslag)
  holiday: number;   // Feestdagen (e.g., 2.00 = 100% toeslag)
}

export const DEFAULT_ORT_RATES: OrtRates = {
  evening: 1.22,  // 22% toeslag
  night: 1.40,    // 40% toeslag
  weekend: 1.35,  // 35% toeslag
  holiday: 2.00,  // 100% toeslag
};

// Dutch national holidays (feestdagen) for a given year
export function getDutchHolidays(year: number): Date[] {
  const holidays: Date[] = [];

  // Fixed holidays
  holidays.push(new Date(year, 0, 1));   // Nieuwjaarsdag (New Year's Day)
  holidays.push(new Date(year, 3, 27));  // Koningsdag (King's Day) - April 27
  holidays.push(new Date(year, 4, 5));   // Bevrijdingsdag (Liberation Day) - May 5
  holidays.push(new Date(year, 11, 25)); // Eerste Kerstdag (Christmas Day)
  holidays.push(new Date(year, 11, 26)); // Tweede Kerstdag (Boxing Day)

  // Easter-based holidays (need to calculate Easter first)
  const easter = calculateEaster(year);
  holidays.push(easter); // Eerste Paasdag (Easter Sunday)
  holidays.push(addDays(easter, 1)); // Tweede Paasdag (Easter Monday)
  holidays.push(addDays(easter, 39)); // Hemelvaartsdag (Ascension Day)
  holidays.push(addDays(easter, 49)); // Eerste Pinksterdag (Whit Sunday)
  holidays.push(addDays(easter, 50)); // Tweede Pinksterdag (Whit Monday)

  return holidays;
}

// Calculate Easter Sunday using the Anonymous Gregorian algorithm
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

export function isHoliday(date: Date): boolean {
  const holidays = getDutchHolidays(date.getFullYear());
  return holidays.some(holiday =>
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
}

export interface HourBreakdown {
  regularHours: number;
  eveningHours: number;  // 18:00-22:00
  nightHours: number;    // 22:00-06:00
  weekendHours: number;
  holidayHours: number;
}

export interface CalculatedOrt {
  baseAmount: number;
  eveningOrt: number;
  nightOrt: number;
  weekendOrt: number;
  holidayOrt: number;
  totalOrt: number;
  totalAmount: number;
}

// Calculate ORT for a single day's hours
export function calculateOrtForDay(
  date: Date,
  hours: HourBreakdown,
  hourlyRate: number,
  rates: OrtRates = DEFAULT_ORT_RATES
): CalculatedOrt {
  const isWeekendDay = isWeekend(date);
  const isHolidayDay = isHoliday(date);

  // Base calculation for regular hours
  const totalRegularHours = hours.regularHours;
  const baseAmount = totalRegularHours * hourlyRate;

  // Calculate ORT amounts
  // Note: Weekend and holiday rates apply to ALL hours worked on those days
  // Evening and night rates are for specific time periods

  let eveningOrt = 0;
  let nightOrt = 0;
  let weekendOrt = 0;
  let holidayOrt = 0;

  // Evening hours ORT (18:00-22:00)
  if (hours.eveningHours > 0) {
    eveningOrt = hours.eveningHours * hourlyRate * (rates.evening - 1);
  }

  // Night hours ORT (22:00-06:00)
  if (hours.nightHours > 0) {
    nightOrt = hours.nightHours * hourlyRate * (rates.night - 1);
  }

  // Weekend ORT (applies to all hours on weekend days)
  if (isWeekendDay && hours.weekendHours > 0) {
    weekendOrt = hours.weekendHours * hourlyRate * (rates.weekend - 1);
  }

  // Holiday ORT (applies to all hours on holidays, replaces weekend if applicable)
  if (isHolidayDay && hours.holidayHours > 0) {
    holidayOrt = hours.holidayHours * hourlyRate * (rates.holiday - 1);
    // Don't double-count weekend if it's also a holiday
    if (isWeekendDay) {
      weekendOrt = 0;
    }
  }

  const totalOrt = eveningOrt + nightOrt + weekendOrt + holidayOrt;
  const totalAmount = baseAmount + totalOrt;

  return {
    baseAmount,
    eveningOrt,
    nightOrt,
    weekendOrt,
    holidayOrt,
    totalOrt,
    totalAmount,
  };
}

// Calculate ORT for multiple hour registrations
export function calculateOrtForPeriod(
  registrations: Array<{
    date: Date;
    regularHours: number;
    ortEvening: number;
    ortNight: number;
    ortWeekend: number;
    ortHoliday: number;
  }>,
  hourlyRate: number,
  rates: OrtRates = DEFAULT_ORT_RATES
): {
  totalRegularHours: number;
  totalEveningHours: number;
  totalNightHours: number;
  totalWeekendHours: number;
  totalHolidayHours: number;
  breakdown: CalculatedOrt;
} {
  let totalRegularHours = 0;
  let totalEveningHours = 0;
  let totalNightHours = 0;
  let totalWeekendHours = 0;
  let totalHolidayHours = 0;

  let totalBaseAmount = 0;
  let totalEveningOrt = 0;
  let totalNightOrt = 0;
  let totalWeekendOrt = 0;
  let totalHolidayOrt = 0;

  for (const reg of registrations) {
    const hours: HourBreakdown = {
      regularHours: reg.regularHours,
      eveningHours: reg.ortEvening,
      nightHours: reg.ortNight,
      weekendHours: reg.ortWeekend,
      holidayHours: reg.ortHoliday,
    };

    const dayOrt = calculateOrtForDay(reg.date, hours, hourlyRate, rates);

    totalRegularHours += reg.regularHours;
    totalEveningHours += reg.ortEvening;
    totalNightHours += reg.ortNight;
    totalWeekendHours += reg.ortWeekend;
    totalHolidayHours += reg.ortHoliday;

    totalBaseAmount += dayOrt.baseAmount;
    totalEveningOrt += dayOrt.eveningOrt;
    totalNightOrt += dayOrt.nightOrt;
    totalWeekendOrt += dayOrt.weekendOrt;
    totalHolidayOrt += dayOrt.holidayOrt;
  }

  const totalOrt = totalEveningOrt + totalNightOrt + totalWeekendOrt + totalHolidayOrt;

  return {
    totalRegularHours,
    totalEveningHours,
    totalNightHours,
    totalWeekendHours,
    totalHolidayHours,
    breakdown: {
      baseAmount: totalBaseAmount,
      eveningOrt: totalEveningOrt,
      nightOrt: totalNightOrt,
      weekendOrt: totalWeekendOrt,
      holidayOrt: totalHolidayOrt,
      totalOrt,
      totalAmount: totalBaseAmount + totalOrt,
    },
  };
}

// Format currency for Dutch locale
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Format hours with Dutch decimal separator
export function formatHours(hours: number): string {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(hours);
}
