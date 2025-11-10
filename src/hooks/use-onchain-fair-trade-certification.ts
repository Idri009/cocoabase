import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFairTradeCertification,
  verifyFairTradeCertification,
  calculateFairTradePremium,
  revokeFairTradeCertification,
  checkFairTradeExpiry,
  type FairTradeCertification,
} from '@/lib/onchain-fair-trade-certification-utils';

/**
 * Hook for onchain fair trade certification operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainFairTradeCertification() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [certifications, setCertifications] = useState<FairTradeCertification[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const registerCertification = async (
    certificationBody: string,
    certificationNumber: string,
    productType: string,
    issueDate: bigint,
    expiryDate: bigint,
    premiumPercentage: number,
    verificationHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRegistering(true);
    try {
      const certification = createFairTradeCertification(
        address,
        certificationBody,
        certificationNumber,
        productType,
        issueDate,
        expiryDate,
        premiumPercentage,
        verificationHash
      );
      setCertifications((prev) => [...prev, certification]);
      console.log('Registering fair trade certification:', certification);
      // Onchain registration via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'registerFairTradeCertification',
        args: [certificationBody, certificationNumber, productType, issueDate, expiryDate, premiumPercentage, verificationHash],
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const verifyCertification = async (certificationId: bigint): Promise<boolean> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const certification = certifications.find((c) => c.id === certificationId);
      if (!certification) throw new Error('Certification not found');
      const currentTime = BigInt(Date.now());
      const isValid = verifyFairTradeCertification(certification, currentTime);
      console.log('Verifying fair trade certification:', { certificationId, isValid });
      // Onchain verification via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'verifyFairTradeCertification',
        args: [certificationId],
      });
      return isValid;
    } finally {
      // Verification complete
    }
  };

  return {
    certifications,
    registerCertification,
    verifyCertification,
    calculateFairTradePremium,
    revokeFairTradeCertification,
    checkFairTradeExpiry,
    isRegistering,
    address,
  };
}

