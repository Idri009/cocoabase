import { type Address } from 'viem';

export interface DebtRegistry {
  id: bigint;
  borrower: Address;
  lender: Address;
  principal: bigint;
  interest: bigint;
  dueDate: bigint;
  status: 'active' | 'repaid' | 'defaulted';
}

export function createDebtRegistry(
  borrower: Address,
  lender: Address,
  principal: bigint,
  interest: bigint,
  dueDate: bigint
): DebtRegistry {
  return {
    id: BigInt(0),
    borrower,
    lender,
    principal,
    interest,
    dueDate,
    status: 'active',
  };
}
