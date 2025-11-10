import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDerivative,
  exerciseDerivative,
  isDerivativeExpired,
  calculateDerivativePayout,
  type Derivative,
} from '@/lib/onchain-derivatives-utils';

/**
 * Hook for onchain derivatives operations
 */
export function useOnchainDerivatives() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [derivatives, setDerivatives] = useState<Derivative[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isExercising, setIsExercising] = useState(false);

  const createNewDerivative = async (
    underlyingAsset: string,
    strikePrice: bigint,
    expiryTime: bigint,
    premium: bigint,
    token: Address,
    type: 'call' | 'put',
    positionSize: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const derivative = createDerivative(
        address,
        underlyingAsset,
        strikePrice,
        expiryTime,
        premium,
        token,
        type,
        positionSize
      );
      console.log('Creating derivative:', derivative);
      // Onchain derivative creation via smart contract
    } finally {
      setIsCreating(false);
    }
  };

  const exerciseDerivativeContract = async (
    derivativeId: bigint,
    currentPrice: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsExercising(true);
    try {
      const currentTime = BigInt(Date.now());
      const derivative = derivatives.find((d) => d.id === derivativeId);
      if (!derivative) throw new Error('Derivative not found');
      const updated = exerciseDerivative(
        derivative,
        address,
        currentPrice,
        currentTime
      );
      if (updated) {
        console.log('Exercising derivative:', { derivativeId, address });
        // Onchain exercise via smart contract
      }
    } finally {
      setIsExercising(false);
    }
  };

  return {
    derivatives,
    createNewDerivative,
    exerciseDerivativeContract,
    isCreating,
    isExercising,
    isDerivativeExpired,
    calculateDerivativePayout,
    address,
  };
}

