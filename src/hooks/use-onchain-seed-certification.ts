import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  certifySeed,
  type SeedCertification,
} from '@/lib/onchain-seed-certification-utils';

export function useOnchainSeedCertification() {
  const { address } = useAccount();
  const [certifications, setCertifications] = useState<SeedCertification[]>([]);

  const certifyNewSeed = async (
    seedType: string,
    certificationNumber: string,
    validityDays: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const cert = certifySeed(address, seedType, certificationNumber, validityDays);
    setCertifications([...certifications, cert]);
  };

  return { certifications, certifyNewSeed, address };
}
