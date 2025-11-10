import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRenewalRequest,
  submitRenewal,
  approveRenewal,
  isRenewalDue,
  type CertificationRenewal,
} from '@/lib/onchain-farm-certification-renewal-utils';

/**
 * Hook for onchain farm certification renewal operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainFarmCertificationRenewal() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [renewals, setRenewals] = useState<CertificationRenewal[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestRenewal = async (
    certificationType: string,
    certificationNumber: string,
    expiryDate: bigint,
    renewalFee: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRequesting(true);
    try {
      const renewal = createRenewalRequest(address, certificationType, certificationNumber, expiryDate, renewalFee);
      setRenewals((prev) => [...prev, renewal]);
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'requestCertificationRenewal',
        args: [certificationType, certificationNumber, expiryDate, renewalFee],
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    renewals,
    requestRenewal,
    submitRenewal,
    approveRenewal,
    isRenewalDue,
    isRequesting,
    address,
  };
}

