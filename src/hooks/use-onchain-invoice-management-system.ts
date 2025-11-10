import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createInvoice,
  type Invoice,
} from '@/lib/onchain-invoice-management-system-utils';

export function useOnchainInvoiceManagementSystem() {
  const { address } = useAccount();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const create = async (
    recipient: Address,
    amount: bigint,
    dueDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const invoice = createInvoice(address, recipient, amount, dueDate);
    setInvoices([...invoices, invoice]);
  };

  return { invoices, create, address };
}
