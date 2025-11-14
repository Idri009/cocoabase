import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPoolMember,
  createClaim,
  type PoolMember,
  type Claim,
} from '@/lib/onchain-farm-crop-insurance-pool-utils';

/**
 * Hook for onchain farm crop insurance pool
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropInsurancePool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [poolMembers, setPoolMembers] = useState<PoolMember[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  const joinPool = async (
    contractAddress: Address,
    coverageAmount: bigint,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const member = createPoolMember(address, value, coverageAmount);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'coverageAmount', type: 'uint256' }],
          name: 'joinPool',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'joinPool',
      args: [coverageAmount],
      value: value,
    });
    
    setPoolMembers([...poolMembers, member]);
  };

  const submitClaim = async (
    contractAddress: Address,
    claimAmount: bigint,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const claim = createClaim(address, claimAmount, reason);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'claimAmount', type: 'uint256' },
            { name: 'reason', type: 'string' }
          ],
          name: 'submitClaim',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'submitClaim',
      args: [claimAmount, reason],
    });
    
    setClaims([...claims, claim]);
  };

  const approveClaim = async (
    contractAddress: Address,
    claimId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'claimId', type: 'uint256' }],
          name: 'approveClaim',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'approveClaim',
      args: [claimId],
    });
  };

  const processClaim = async (
    contractAddress: Address,
    claimId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'claimId', type: 'uint256' }],
          name: 'processClaim',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'processClaim',
      args: [claimId],
    });
  };

  return { 
    poolMembers,
    claims,
    joinPool, 
    submitClaim,
    approveClaim,
    processClaim,
    address 
  };
}

