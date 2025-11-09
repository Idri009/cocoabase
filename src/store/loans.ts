import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type LoanStatus = "active" | "paid_off" | "defaulted" | "pending";

export type Loan = {
  id: string;
  lender: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  status: LoanStatus;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  plantationId?: string;
  purpose?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type LoanDraft = Omit<
  Loan,
  "id" | "createdAt" | "updatedAt" | "monthlyPayment" | "totalInterest" | "totalAmount"
> & {
  id?: string;
};

type LoanState = {
  loans: Loan[];
  addLoan: (draft: LoanDraft) => Loan;
  updateLoan: (id: string, updates: Partial<LoanDraft>) => void;
  removeLoan: (id: string) => void;
  getActiveLoans: () => Loan[];
  calculateLoan: (
    principal: number,
    interestRate: number,
    termMonths: number
  ) => { monthlyPayment: number; totalInterest: number; totalAmount: number };
};

const generateLoanId = () =>
  `loan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const calculateLoanPayment = (
  principal: number,
  annualRate: number,
  termMonths: number
) => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / termMonths,
      totalInterest: 0,
      totalAmount: principal,
    };
  }
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalAmount = monthlyPayment * termMonths;
  const totalInterest = totalAmount - principal;
  return { monthlyPayment, totalInterest, totalAmount };
};

export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      loans: [],

      calculateLoan: (principal, interestRate, termMonths) => {
        return calculateLoanPayment(principal, interestRate, termMonths);
      },

      addLoan: (draft) => {
        const now = new Date().toISOString();
        const calculations = calculateLoanPayment(
          draft.principal,
          draft.interestRate,
          draft.termMonths
        );
        const loan: Loan = {
          ...draft,
          id: draft.id ?? generateLoanId(),
          monthlyPayment: calculations.monthlyPayment,
          totalInterest: calculations.totalInterest,
          totalAmount: calculations.totalAmount,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          loans: [...state.loans, loan],
        }));
        return loan;
      },

      updateLoan: (id, updates) => {
        set((state) => ({
          loans: state.loans.map((loan) => {
            if (loan.id === id) {
              const updated = { ...loan, ...updates };
              if (
                updates.principal !== undefined ||
                updates.interestRate !== undefined ||
                updates.termMonths !== undefined
              ) {
                const calculations = calculateLoanPayment(
                  updated.principal,
                  updated.interestRate,
                  updated.termMonths
                );
                updated.monthlyPayment = calculations.monthlyPayment;
                updated.totalInterest = calculations.totalInterest;
                updated.totalAmount = calculations.totalAmount;
              }
              updated.updatedAt = new Date().toISOString();
              return updated;
            }
            return loan;
          }),
        }));
      },

      removeLoan: (id) => {
        set((state) => ({
          loans: state.loans.filter((loan) => loan.id !== id),
        }));
      },

      getActiveLoans: () => {
        return get().loans.filter((loan) => loan.status === "active");
      },
    }),
    {
      name: "cocoa-chain-loans",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<LoanState>
  )
);

