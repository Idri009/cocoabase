import { type Address } from 'viem';

/**
 * Onchain farm crop financing utilities
 * Crop financing system
 */

export interface FinancingApplication {
  id: string;
  applicationId: bigint;
  farmer: Address;
  cropId: bigint;
  requestedAmount: bigint;
  interestRate: bigint;
  termDays: bigint;
  purpose: string;
  applicationDate: bigint;
  isApproved: boolean;
  isFunded: boolean;
  isRepaid: boolean;
}

export interface Repayment {
  id: string;
  repaymentId: bigint;
  applicationId: bigint;
  farmer: Address;
  amount: bigint;
  repaymentDate: bigint;
  isCompleted: boolean;
}

export function createFinancingApplication(
  address: Address,
  cropId: bigint,
  requestedAmount: bigint,
  interestRate: bigint,
  termDays: bigint,
  purpose: string
): FinancingApplication {
  return {
    id: `${Date.now()}-${Math.random()}`,
    applicationId: BigInt(0),
    farmer: address,
    cropId,
    requestedAmount,
    interestRate,
    termDays,
    purpose,
    applicationDate: BigInt(Date.now()),
    isApproved: false,
    isFunded: false,
    isRepaid: false,
  };
}

export function createRepayment(
  address: Address,
  applicationId: bigint,
  amount: bigint
): Repayment {
  return {
    id: `${Date.now()}-${Math.random()}`,
    repaymentId: BigInt(0),
    applicationId,
    farmer: address,
    amount,
    repaymentDate: BigInt(Date.now()),
    isCompleted: true,
  };
}

