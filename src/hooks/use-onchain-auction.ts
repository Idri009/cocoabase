import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createAuction,
  placeBid,
  isAuctionActive,
  endAuction,
  calculateAuctionFee,
  getTimeRemaining,
  type Auction,
} from '@/lib/onchain-auction-utils';

/**
 * Hook for onchain auction operations
 */
export function useOnchainAuction() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isBidding, setIsBidding] = useState(false);

  const createNewAuction = async (
    tokenId: bigint,
    tokenContract: Address,
    startingPrice: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const auction = createAuction(
        address,
        tokenId,
        tokenContract,
        startingPrice,
        duration
      );
      console.log('Creating auction:', auction);
      // Onchain auction creation via smart contract
    } finally {
      setIsCreating(false);
    }
  };

  const bidOnAuction = async (
    auctionId: bigint,
    bidAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsBidding(true);
    try {
      const currentTime = BigInt(Date.now());
      const auction = auctions.find((a) => a.id === auctionId);
      if (!auction) throw new Error('Auction not found');
      const updated = placeBid(auction, address, bidAmount, currentTime);
      if (updated) {
        console.log('Placing bid:', { auctionId, bidAmount, address });
        // Onchain bid via smart contract
      }
    } finally {
      setIsBidding(false);
    }
  };

  return {
    auctions,
    createNewAuction,
    bidOnAuction,
    isCreating,
    isBidding,
    isAuctionActive,
    endAuction,
    calculateAuctionFee,
    getTimeRemaining,
    address,
  };
}

