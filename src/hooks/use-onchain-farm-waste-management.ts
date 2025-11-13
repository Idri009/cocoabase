import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createWasteRecord,
  type WasteRecord,
} from '@/lib/onchain-farm-waste-management-utils';

export function useOnchainFarmWasteManagement() {
  const { address } = useAccount();
  const [records, setRecords] = useState<WasteRecord[]>([]);

  const create = async (
    type: string,
    amount: bigint,
    disposalMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createWasteRecord(address, type, amount, disposalMethod);
    setRecords([...records, record]);
  };

  return { records, create, address };
}
