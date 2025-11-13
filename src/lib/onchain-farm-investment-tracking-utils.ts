import { type Address } from 'viem';

export interface Investment {
  id: string;
  investmentId: bigint;
  investor: Address;
  amount: bigint;
  date: bigint;
  investmentType: string;
  expectedReturn: bigint;
  actualReturn: bigint;
  completed: boolean;
}

export function createInvestment(
  investor: Address,
  investmentId: bigint,
  amount: bigint,
  investmentType: string,
  expectedReturn: bigint
): Investment {
  return {
    id: `${Date.now()}-${Math.random()}`,
    investmentId,
    investor,
    amount,
    date: BigInt(Date.now()),
    investmentType,
    expectedReturn,
    actualReturn: BigInt(0),
    completed: false,
  };
}
