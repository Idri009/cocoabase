import { type Address } from 'viem';

/**
 * Onchain Farmer Reputation System utilities
 * Build farmer reputation onchain
 */

export interface ReputationScore {
  address: Address;
  overallScore: number;
  reliabilityScore: number;
  qualityScore: number;
  deliveryScore: number;
  reviewCount: number;
  lastUpdated: bigint;
}

export interface ReputationReview {
  id: bigint;
  farmer: Address;
  reviewer: Address;
  rating: number;
  category: 'reliability' | 'quality' | 'delivery';
  comment: string;
  timestamp: bigint;
}

export function createReputationScore(address: Address): ReputationScore {
  const now = BigInt(Date.now());
  return {
    address,
    overallScore: 0,
    reliabilityScore: 0,
    qualityScore: 0,
    deliveryScore: 0,
    reviewCount: 0,
    lastUpdated: now,
  };
}

export function addReputationReview(
  score: ReputationScore,
  review: ReputationReview
): ReputationScore {
  const now = BigInt(Date.now());
  const newReviewCount = score.reviewCount + 1;
  
  let updatedReliability = score.reliabilityScore;
  let updatedQuality = score.qualityScore;
  let updatedDelivery = score.deliveryScore;
  
  if (review.category === 'reliability') {
    updatedReliability = (score.reliabilityScore * score.reviewCount + review.rating) / newReviewCount;
  } else if (review.category === 'quality') {
    updatedQuality = (score.qualityScore * score.reviewCount + review.rating) / newReviewCount;
  } else if (review.category === 'delivery') {
    updatedDelivery = (score.deliveryScore * score.reviewCount + review.rating) / newReviewCount;
  }
  
  const overallScore = (updatedReliability + updatedQuality + updatedDelivery) / 3;
  
  return {
    ...score,
    overallScore,
    reliabilityScore: updatedReliability,
    qualityScore: updatedQuality,
    deliveryScore: updatedDelivery,
    reviewCount: newReviewCount,
    lastUpdated: now,
  };
}

export function calculateReputationTier(score: ReputationScore): string {
  if (score.overallScore >= 90) return 'Elite';
  if (score.overallScore >= 75) return 'Expert';
  if (score.overallScore >= 60) return 'Professional';
  if (score.overallScore >= 40) return 'Intermediate';
  return 'Beginner';
}

export function isReputationVerified(score: ReputationScore): boolean {
  return score.reviewCount >= 10 && score.overallScore >= 70;
}

