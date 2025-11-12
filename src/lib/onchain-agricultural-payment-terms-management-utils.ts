import { type Address } from 'viem';

export interface PaymentTerms {
  id: bigint;
  owner: Address;
  counterparty: Address;
  terms: string;
  dueDays: number;
  createdDate: bigint;
  status: 'active' | 'expired';
  txHash: string;
}

export function createPaymentTerms(
  owner: Address,
  counterparty: Address,
  terms: string,
  dueDays: number
): PaymentTerms {
  return {
    id: BigInt(Date.now()),
    owner,
    counterparty,
    terms,
    dueDays,
    createdDate: BigInt(Date.now()),
    status: 'active',
    txHash: '',
  };
}

export function getActiveTerms(
  terms: PaymentTerms[]
): PaymentTerms[] {
  return terms.filter((t) => t.status === 'active');
}

export function getTermsByCounterparty(
  terms: PaymentTerms[],
  counterparty: Address
): PaymentTerms[] {
  return terms.filter(
    (t) => t.counterparty.toLowerCase() === counterparty.toLowerCase()
  );
}

export function calculateDueDate(
  terms: PaymentTerms
): bigint {
  const dueDate = Number(terms.createdDate) + terms.dueDays * 24 * 60 * 60 * 1000;
  return BigInt(dueDate);
}
