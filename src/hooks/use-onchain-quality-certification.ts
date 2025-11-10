import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  certifyQuality,
  type QualityCertification,
} from '@/lib/onchain-quality-certification-utils';

export function useOnchainQualityCertification() {
  const { address } = useAccount();
  const [certifications, setCertifications] = useState<QualityCertification[]>([]);

  const certifyProduct = async (
    productId: bigint,
    qualityGrade: string,
    certifier: Address,
    validityDays: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const cert = certifyQuality(address, productId, qualityGrade, certifier, validityDays);
    setCertifications([...certifications, cert]);
  };

  return { certifications, certifyProduct, address };
}
