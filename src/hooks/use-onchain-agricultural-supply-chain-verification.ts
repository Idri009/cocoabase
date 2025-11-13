import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createVerification,
  type VerificationRecord,
} from '@/lib/onchain-agricultural-supply-chain-verification-utils';

export function useOnchainAgriculturalSupplyChainVerification() {
  const { address } = useAccount();
  const [records, setRecords] = useState<VerificationRecord[]>([]);

  const create = async (
    productId: bigint,
    verified: boolean
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createVerification(address, productId, verified);
    setRecords([...records, record]);
  };

  return { records, create, address };
}
