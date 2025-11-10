import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  storeReceipt,
  type Receipt,
} from '@/lib/onchain-receipt-storage-system-utils';

export function useOnchainReceiptStorageSystem() {
  const { address } = useAccount();
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const store = async (
    amount: bigint,
    description: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const receipt = storeReceipt(address, amount, description);
    setReceipts([...receipts, receipt]);
  };

  return { receipts, store, address };
}
