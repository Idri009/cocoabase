import { type Address } from 'viem';

export interface Receipt {
  id: bigint;
  owner: Address;
  amount: bigint;
  receiptDate: bigint;
  description: string;
  txHash: string;
}

export function storeReceipt(
  owner: Address,
  amount: bigint,
  description: string
): Receipt {
  return {
    id: BigInt(Date.now()),
    owner,
    amount,
    receiptDate: BigInt(Date.now()),
    description,
    txHash: '',
  };
}

export function getReceiptsByDateRange(
  receipts: Receipt[],
  startDate: bigint,
  endDate: bigint
): Receipt[] {
  return receipts.filter(
    (r) => r.receiptDate >= startDate && r.receiptDate <= endDate
  );
}

export function getTotalReceiptAmount(
  receipts: Receipt[]
): bigint {
  return receipts.reduce((total, r) => total + r.amount, BigInt(0));
}
