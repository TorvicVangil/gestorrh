// INSS 2026 brackets (simplified, based on recent tables)
const INSS_BRACKETS = [
  { limit: 1518.00, rate: 0.075 },
  { limit: 2793.88, rate: 0.09 },
  { limit: 5585.76, rate: 0.12 },
  { limit: 7786.02, rate: 0.14 },
];

// IRRF 2026 brackets (simplified)
const IRRF_BRACKETS = [
  { limit: 2259.20, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Infinity, rate: 0.275, deduction: 896.00 },
];

export function calculateINSS(grossSalary: number): number {
  let inss = 0;
  let previousLimit = 0;

  for (const bracket of INSS_BRACKETS) {
    if (grossSalary <= previousLimit) break;
    const taxableAmount = Math.min(grossSalary, bracket.limit) - previousLimit;
    if (taxableAmount > 0) {
      inss += taxableAmount * bracket.rate;
    }
    previousLimit = bracket.limit;
  }

  return Math.round(inss * 100) / 100;
}

export function calculateIRRF(grossSalary: number, inssDiscount: number): number {
  const base = grossSalary - inssDiscount;

  for (const bracket of IRRF_BRACKETS) {
    if (base <= bracket.limit) {
      const irrf = base * bracket.rate - bracket.deduction;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }

  const last = IRRF_BRACKETS[IRRF_BRACKETS.length - 1];
  return Math.max(0, Math.round((base * last.rate - last.deduction) * 100) / 100);
}

export function calculateOvertimeValue(baseSalary: number, overtimeHours: number, overtimeRate: number = 1.5): number {
  // Hourly rate = salary / 220 (standard monthly hours in Brazil)
  const hourlyRate = baseSalary / 220;
  return Math.round(hourlyRate * overtimeHours * overtimeRate * 100) / 100;
}

export interface PayrollCalculation {
  baseSalary: number;
  bonus: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimeValue: number;
  attendanceBonus: number;
  grossSalary: number;
  inssDiscount: number;
  irrfDiscount: number;
  vtDiscount: number;
  vrDiscount: number;
  otherDiscounts: number;
  totalDiscounts: number;
  netSalary: number;
}

export function calculatePayroll(params: {
  baseSalary: number;
  bonus: number;
  overtimeHours: number;
  overtimeRate: number;
  attendanceBonus: number;
  vtDiscount: number;
  vrDiscount: number;
  otherDiscounts: number;
}): PayrollCalculation {
  const overtimeValue = calculateOvertimeValue(params.baseSalary, params.overtimeHours, params.overtimeRate);
  const grossSalary = params.baseSalary + params.bonus + overtimeValue + params.attendanceBonus;
  const inssDiscount = calculateINSS(grossSalary);
  const irrfDiscount = calculateIRRF(grossSalary, inssDiscount);
  const totalDiscounts = inssDiscount + irrfDiscount + params.vtDiscount + params.vrDiscount + params.otherDiscounts;
  const netSalary = grossSalary - totalDiscounts;

  return {
    baseSalary: params.baseSalary,
    bonus: params.bonus,
    overtimeHours: params.overtimeHours,
    overtimeRate: params.overtimeRate,
    overtimeValue,
    attendanceBonus: params.attendanceBonus,
    grossSalary: Math.round(grossSalary * 100) / 100,
    inssDiscount,
    irrfDiscount,
    vtDiscount: params.vtDiscount,
    vrDiscount: params.vrDiscount,
    otherDiscounts: params.otherDiscounts,
    totalDiscounts: Math.round(totalDiscounts * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
