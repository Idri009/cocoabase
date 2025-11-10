import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createReputationScore,
  addReputationReview,
  calculateReputationTier,
  isReputationVerified,
  type ReputationScore,
  type ReputationReview,
} from '@/lib/onchain-farmer-reputation-system-utils';

/**
 * Hook for onchain farmer reputation system operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainFarmerReputationSystem() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [reputationScores, setReputationScores] = useState<ReputationScore[]>([]);
  const [reviews, setReviews] = useState<ReputationReview[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);

  const initializeReputation = async (farmerAddress: Address): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const score = createReputationScore(farmerAddress);
      setReputationScores((prev) => [...prev, score]);
      console.log('Initializing reputation score:', score);
      // Onchain initialization via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'initializeReputation',
        args: [farmerAddress],
      });
    } finally {
      // Initialization complete
    }
  };

  const submitReview = async (
    farmer: Address,
    rating: number,
    category: ReputationReview['category'],
    comment: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsReviewing(true);
    try {
      const review: ReputationReview = {
        id: BigInt(0),
        farmer,
        reviewer: address,
        rating,
        category,
        comment,
        timestamp: BigInt(Date.now()),
      };
      setReviews((prev) => [...prev, review]);
      
      const existingScore = reputationScores.find((s) => s.address === farmer);
      if (existingScore) {
        const updated = addReputationReview(existingScore, review);
        setReputationScores((prev) =>
          prev.map((s) => (s.address === farmer ? updated : s))
        );
      }
      
      console.log('Submitting reputation review:', review);
      // Onchain review submission via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'submitReputationReview',
        args: [farmer, rating, category, comment],
      });
    } finally {
      setIsReviewing(false);
    }
  };

  return {
    reputationScores,
    reviews,
    initializeReputation,
    submitReview,
    calculateReputationTier,
    isReputationVerified,
    isReviewing,
    address,
  };
}

