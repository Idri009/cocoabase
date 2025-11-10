import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createOrganicCertification,
  verifyOrganicCertification,
  checkCertificationExpiry,
  revokeCertification,
  calculateDaysUntilExpiry,
  type OrganicCertification,
} from '@/lib/onchain-organic-certification-verification-utils';

/**
 * Hook for onchain organic certification verification operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainOrganicCertificationVerification() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [certifications, setCertifications] = useState<OrganicCertification[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const registerCertification = async (
    certificationBody: string,
    certificationNumber: string,
    cropType: string,
    issueDate: bigint,
    expiryDate: bigint,
    verificationHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRegistering(true);
    try {
      const certification = createOrganicCertification(
        address,
        certificationBody,
        certificationNumber,
        cropType,
        issueDate,
        expiryDate,
        verificationHash
      );
      setCertifications((prev) => [...prev, certification]);
      console.log('Registering organic certification:', certification);
      // Onchain registration via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'registerOrganicCertification',
        args: [certificationBody, certificationNumber, cropType, issueDate, expiryDate, verificationHash],
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
      const isValid = verifyOrganicCertification(certification, currentTime);
      console.log('Verifying certification:', { certificationId, isValid });
      // Onchain verification via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'verifyOrganicCertification',
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
    checkCertificationExpiry,
    revokeCertification,
    calculateDaysUntilExpiry,
    isRegistering,
    address,
  };
}

