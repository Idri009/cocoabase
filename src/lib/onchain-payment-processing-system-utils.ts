import { type Address } from 'viem';

export interface Payment {
  id: bigint;
  payer: Address;
  payee: Address;
  amount: bigint;
  paymentDate: bigint;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
}

export function processPayment(
  payer: Address,
  payee: Address,
  amount: bigint
): Payment {
  return {
    id: BigInt(Date.now()),
    payer,
    payee,
    amount,
    paymentDate: BigInt(Date.now()),
    status: 'pending',
    txHash: '',
  };
}

export function completePayment(
  payment: Payment
): Payment {
  return {
    ...payment,
    status: 'completed',
  };
}

export function getPendingPayments(
  payments: Payment[]
): Payment[] {
  return payments.filter((p) => p.status === 'pending');
}

export function getTotalPayments(
  payments: Payment[],
  address: Address
): bigint {
  return payments
    .filter((p) => p.payee.toLowerCase() === address.toLowerCase() && p.status === 'completed')
    .reduce((total, p) => total + p.amount, BigInt(0));
}
