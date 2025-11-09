export type LoanStatus = "pending" | "approved" | "active" | "paid-off" | "defaulted";

export type PaymentFrequency = "monthly" | "quarterly" | "yearly";

export interface Loan {
  id: string;
  principal: number;
  interestRate: number;
  term: number;
  frequency: PaymentFrequency;
  startDate: Date;
  status: LoanStatus;
  lender?: string;
  purpose?: string;
  notes?: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  paymentNumber: number;
  dueDate: Date;
  amount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  paid: boolean;
  paidDate?: Date;
}

export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  termMonths: number
): number => {
  if (annualRate === 0) {
    return principal / termMonths;
  }

  const monthlyRate = annualRate / 12 / 100;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;

  return numerator / denominator;
};

export const calculateLoanPayments = (loan: Loan): LoanPayment[] => {
  const payments: LoanPayment[] = [];
  const monthlyPayment = calculateMonthlyPayment(loan.principal, loan.interestRate, loan.term);
  let remainingBalance = loan.principal;
  const monthlyRate = loan.interestRate / 12 / 100;

  for (let i = 1; i <= loan.term; i++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    remainingBalance = Math.max(0, remainingBalance - principal);

    const dueDate = new Date(loan.startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    payments.push({
      id: `payment-${loan.id}-${i}`,
      loanId: loan.id,
      paymentNumber: i,
      dueDate,
      amount: monthlyPayment,
      principal,
      interest,
      remainingBalance,
      paid: false,
    });
  }

  return payments;
};

export const calculateTotalPayment = (loan: Loan): number => {
  const monthlyPayment = calculateMonthlyPayment(loan.principal, loan.interestRate, loan.term);
  return monthlyPayment * loan.term;
};

export const calculateTotalInterest = (loan: Loan): number => {
  return calculateTotalPayment(loan) - loan.principal;
};

export const getLoanSummary = (loan: Loan): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  interestPercentage: number;
} => {
  const monthlyPayment = calculateMonthlyPayment(loan.principal, loan.interestRate, loan.term);
  const totalPayment = calculateTotalPayment(loan);
  const totalInterest = calculateTotalInterest(loan);
  const interestPercentage = (totalInterest / loan.principal) * 100;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    interestPercentage,
  };
};

export const getUpcomingPayments = (
  payments: LoanPayment[],
  daysAhead: number = 30
): LoanPayment[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return payments.filter((payment) => {
    return !payment.paid && payment.dueDate <= cutoffDate && payment.dueDate >= new Date();
  });
};

export const getOverduePayments = (payments: LoanPayment[]): LoanPayment[] => {
  const now = new Date();
  return payments.filter((payment) => {
    return !payment.paid && payment.dueDate < now;
  });
};

export const calculateLoanProgress = (loan: Loan, payments: LoanPayment[]): number => {
  const paidPayments = payments.filter((p) => p.paid).length;
  return loan.term > 0 ? (paidPayments / loan.term) * 100 : 0;
};

export const getLoanStatus = (loan: Loan, payments: LoanPayment[]): LoanStatus => {
  if (loan.status === "paid-off" || loan.status === "defaulted") {
    return loan.status;
  }

  const overdue = getOverduePayments(payments);
  if (overdue.length > 0) {
    return "defaulted";
  }

  const progress = calculateLoanProgress(loan, payments);
  if (progress >= 100) {
    return "paid-off";
  }

  return loan.status;
};

export const calculateRemainingBalance = (payments: LoanPayment[]): number => {
  const unpaidPayments = payments.filter((p) => !p.paid);
  if (unpaidPayments.length === 0) return 0;
  return unpaidPayments[0].remainingBalance;
};

export const getLoanSummaryStats = (loans: Loan[]): {
  total: number;
  totalPrincipal: number;
  totalMonthlyPayments: number;
  totalInterest: number;
  byStatus: Record<LoanStatus, number>;
} => {
  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal, 0);
  const totalMonthlyPayments = loans.reduce(
    (sum, loan) => sum + calculateMonthlyPayment(loan.principal, loan.interestRate, loan.term),
    0
  );
  const totalInterest = loans.reduce(
    (sum, loan) => sum + calculateTotalInterest(loan),
    0
  );

  const byStatus = loans.reduce(
    (acc, loan) => {
      if (!acc[loan.status]) {
        acc[loan.status] = 0;
      }
      acc[loan.status]++;
      return acc;
    },
    {} as Record<LoanStatus, number>
  );

  return {
    total: loans.length,
    totalPrincipal,
    totalMonthlyPayments,
    totalInterest,
    byStatus: {
      pending: byStatus.pending || 0,
      approved: byStatus.approved || 0,
      active: byStatus.active || 0,
      "paid-off": byStatus["paid-off"] || 0,
      defaulted: byStatus.defaulted || 0,
    },
  };
};

