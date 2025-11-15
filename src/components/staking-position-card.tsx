'use client';

import { type StakingPosition } from '@/lib/staking-utils';
import { canUnstake, calculateStakingAPY } from '@/lib/staking-utils';
import { formatTokenAmount } from '@/lib/token-utils';

interface StakingPositionCardProps {
  position: StakingPosition;
}

export function StakingPositionCard({ position }: StakingPositionCardProps) {
  const unstakeable = canUnstake(position);
  const apy = calculateStakingAPY(position.rewardRate);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">Staking Position</h3>
        {unstakeable && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
            Unstakeable
          </span>
        )}
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Staked:</span>
          <span>{formatTokenAmount(position.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">APY:</span>
          <span className="font-semibold">{apy.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rewards:</span>
          <span>{formatTokenAmount(position.claimedRewards)}</span>
        </div>
      </div>
    </div>
  );
}



