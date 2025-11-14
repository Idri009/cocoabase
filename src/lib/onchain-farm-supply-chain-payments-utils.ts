import { type Address } from 'viem';

export interface Payment {
  id: string;
  paymentId: bigint;
  payer: Address;
  payee: Address;
  amount: bigint;
  invoiceId: string;
  dueDate: bigint;
  paid: boolean;
  paidDate?: bigint;
}

export function createPayment(
  address: Address,
  payee: Address,
  amount: bigint,
  invoiceId: string,
  dueDate: bigint
): Payment {
  return {
    id: `${Date.now()}-${Math.random()}`,
    paymentId: BigInt(0),
    payer: address,
    payee,
    amount,
    invoiceId,
    dueDate,
    paid: false,
  };
}
