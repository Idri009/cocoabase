import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCertification,
  type Certification,
} from '@/lib/onchain-farm-crop-certification-utils';

/**
 * Hook for onchain farm crop certification
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropCertification() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const issueCertification = async (
    contractAddress: Address,
    farmer: Address,
    cropId: bigint,
    certificationType: string,
    qualityGrade: string,
    expiryDate: bigint,
    inspector: string,
    notes: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const certification = createCertification(farmer, cropId, certificationType, qualityGrade, expiryDate, inspector, notes);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'farmer', type: 'address' },
            { name: 'cropId', type: 'uint256' },
            { name: 'certificationType', type: 'string' },
            { name: 'qualityGrade', type: 'string' },
            { name: 'expiryDate', type: 'uint256' },
            { name: 'inspector', type: 'string' },
            { name: 'notes', type: 'string' }
          ],
          name: 'issueCertification',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'issueCertification',
      args: [farmer, cropId, certificationType, qualityGrade, expiryDate, inspector, notes],
    });
    
    setCertifications([...certifications, certification]);
  };

  const revokeCertification = async (
    contractAddress: Address,
    certificationId: bigint,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'certificationId', type: 'uint256' },
            { name: 'reason', type: 'string' }
          ],
          name: 'revokeCertification',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'revokeCertification',
      args: [certificationId, reason],
    });
  };

  return { 
    certifications, 
    issueCertification,
    revokeCertification,
    address 
  };
}

