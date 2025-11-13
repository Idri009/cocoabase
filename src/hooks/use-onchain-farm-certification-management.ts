import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCertification,
  type Certification,
} from '@/lib/onchain-farm-certification-management-utils';

/**
 * Hook for onchain farm certification management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCertificationManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const createCert = async (
    plantationId: string,
    certType: string,
    standard: string,
    expiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const cert = createCertification(address, plantationId, certType, standard, expiryDate);
    setCertifications([...certifications, cert]);
  };

  const renewCertification = async (
    contractAddress: Address,
    certId: string,
    newExpiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'renewCertification',
      args: [certId, newExpiryDate],
    });
  };

  return { certifications, createCert, renewCertification, address };
}

