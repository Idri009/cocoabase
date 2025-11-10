import { type Address } from 'viem';

export interface FlashLoan {
  id: bigint;
  borrower: Address;
  token: Address;
  amount: bigint;
  fee: bigint;
  callback: Address;
  status: 'pending' | 'executed' | 'repaid' | 'defaulted';
}

export function createFlashLoan(
  borrower: Address,
  token: Address,
  amount: bigint,
  fee: bigint,
  callback: Address
): FlashLoan {
  return {
    id: BigInt(0),
    borrower,
    token,
    amount,
    fee,
    callback,
    status: 'pending',
  };
}

export function executeFlashLoan(loan: FlashLoan): FlashLoan {
  return { ...loan, status: 'executed' };
}

export function repayFlashLoan(loan: FlashLoan): FlashLoan {
  return { ...loan, status: 'repaid' };
}

export function calculateFlashLoanFee(
  amount: bigint,
  feeRate: number = 0.0009
): bigint {
  return (amount * BigInt(Math.floor(feeRate * 1000000))) / BigInt(1000000);
}

