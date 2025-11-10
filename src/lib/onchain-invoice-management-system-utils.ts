import { type Address } from 'viem';

export interface Invoice {
  id: bigint;
  issuer: Address;
  recipient: Address;
  amount: bigint;
  dueDate: bigint;
  status: 'pending' | 'paid' | 'overdue';
  txHash: string;
}

export function createInvoice(
  issuer: Address,
  recipient: Address,
  amount: bigint,
  dueDate: bigint
): Invoice {
  return {
    id: BigInt(Date.now()),
    issuer,
    recipient,
    amount,
    dueDate,
    status: 'pending',
    txHash: '',
  };
}

export function markInvoicePaid(
  invoice: Invoice
): Invoice {
  return {
    ...invoice,
    status: 'paid',
  };
}

export function getOverdueInvoices(
  invoices: Invoice[],
  currentTime: bigint
): Invoice[] {
  return invoices.filter(
    (i) => i.status === 'pending' && currentTime > i.dueDate
  );
}

export function getTotalInvoiceAmount(
  invoices: Invoice[]
): bigint {
  return invoices
    .filter((i) => i.status === 'pending')
    .reduce((total, i) => total + i.amount, BigInt(0));
}
