import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createCertification,
  type Certification,
} from '@/lib/onchain-agricultural-certification-tracking-utils';

export function useOnchainAgriculturalCertificationTracking() {
  const { address } = useAccount();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const create = async (
    certType: string,
    expiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const cert = createCertification(address, certType, expiryDate);
    setCertifications([...certifications, cert]);
  };

  return { certifications, create, address };
}
