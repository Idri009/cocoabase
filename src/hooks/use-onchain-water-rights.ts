import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  allocateWaterRight,
  type WaterRight,
} from '@/lib/onchain-water-rights-utils';

export function useOnchainWaterRights() {
  const { address } = useAccount();
  const [rights, setRights] = useState<WaterRight[]>([]);

  const allocateWater = async (
    plantationId: bigint,
    allocation: bigint,
    startDate: bigint,
    endDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const right = allocateWaterRight(address, plantationId, allocation, startDate, endDate);
    setRights([...rights, right]);
  };

  return { rights, allocateWater, address };
}
