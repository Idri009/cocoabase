import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLandTenure,
  verifyLandTenure,
  transferLandTenure,
  revokeLandTenure,
  isTenureExpired,
  type LandTenure,
} from '@/lib/onchain-land-tenure-verification-utils';

/**
 * Hook for onchain land tenure verification operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainLandTenureVerification() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [tenures, setTenures] = useState<LandTenure[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const registerLandTenure = async (
    landId: string,
    location: string,
    area: bigint,
    tenureType: LandTenure['tenureType'],
    issueDate: bigint,
    expiryDate: bigint | undefined,
    verificationHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRegistering(true);
    try {
      const tenure = createLandTenure(
        address,
        landId,
        location,
        area,
        tenureType,
        issueDate,
        expiryDate,
        verificationHash
      );
      setTenures((prev) => [...prev, tenure]);
      console.log('Registering land tenure:', tenure);
      // Onchain registration via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'registerLandTenure',
        args: [landId, location, area, tenureType, issueDate, expiryDate, verificationHash],
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const verifyTenure = async (tenureId: bigint): Promise<boolean> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const tenure = tenures.find((t) => t.id === tenureId);
      if (!tenure) throw new Error('Tenure not found');
      const currentTime = BigInt(Date.now());
      const isValid = verifyLandTenure(tenure, currentTime);
      console.log('Verifying land tenure:', { tenureId, isValid });
      // Onchain verification via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'verifyLandTenure',
        args: [tenureId],
      });
      return isValid;
    } finally {
      // Verification complete
    }
  };

  const transferTenure = async (
    tenureId: bigint,
    newOwner: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const tenure = tenures.find((t) => t.id === tenureId);
      if (!tenure) throw new Error('Tenure not found');
      const updated = transferLandTenure(tenure, newOwner);
      setTenures((prev) =>
        prev.map((t) => (t.id === tenureId ? updated : t))
      );
      console.log('Transferring land tenure:', { tenureId, newOwner });
      // Onchain transfer via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'transferLandTenure',
        args: [tenureId, newOwner],
      });
    } finally {
      // Transfer complete
    }
  };

  return {
    tenures,
    registerLandTenure,
    verifyTenure,
    transferTenure,
    revokeLandTenure,
    isTenureExpired,
    isRegistering,
    address,
  };
}

