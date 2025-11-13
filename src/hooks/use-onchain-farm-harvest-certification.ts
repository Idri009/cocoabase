import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createHarvestCert,
  type HarvestCertification,
} from '@/lib/onchain-farm-harvest-certification-utils';

/**
 * Hook for onchain farm harvest certification
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmHarvestCertification() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [certifications, setCertifications] = useState<HarvestCertification[]>([]);

  const certifyHarvest = async (
    harvestId: string,
    certType: string,
    standards: string[],
    certDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const cert = createHarvestCert(address, harvestId, certType, standards, certDate);
    setCertifications([...certifications, cert]);
  };

  const verifyCertification = async (
    contractAddress: Address,
    certId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyCertification',
      args: [certId],
    });
  };

  return { certifications, certifyHarvest, verifyCertification, address };
}

