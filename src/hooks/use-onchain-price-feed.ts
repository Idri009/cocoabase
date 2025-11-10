import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createPriceFeed,
  updatePrice,
  calculatePriceChange,
  isPriceStale,
  formatPrice,
  type PriceFeed,
  type PriceUpdate,
} from '@/lib/onchain-price-feed-utils';

export function useOnchainPriceFeed() {
  const { address } = useAccount();
  const [feeds, setFeeds] = useState<PriceFeed[]>([]);
  const [updates, setUpdates] = useState<PriceUpdate[]>([]);

  const initializeFeed = (
    asset: string,
    price: bigint,
    decimals: number,
    oracle: Address,
    roundId: bigint
  ): PriceFeed => {
    const feed = createPriceFeed(asset, price, decimals, oracle, roundId);
    setFeeds((prev) => [...prev, feed]);
    console.log('Initializing price feed:', feed);
    return feed;
  };

  const updateFeedPrice = (
    feedId: bigint,
    newPrice: bigint,
    newRoundId: bigint
  ): void => {
    const feed = feeds.find((f) => f.id === feedId);
    if (!feed) throw new Error('Feed not found');
    const { feed: updatedFeed, update } = updatePrice(feed, newPrice, newRoundId);
    setFeeds((prev) => prev.map((f) => (f.id === feedId ? updatedFeed : f)));
    setUpdates((prev) => [...prev, update]);
    console.log('Updating price feed:', { feedId, update });
  };

  return {
    feeds,
    updates,
    initializeFeed,
    updateFeedPrice,
    calculatePriceChange,
    isPriceStale,
    formatPrice,
    address,
  };
}

