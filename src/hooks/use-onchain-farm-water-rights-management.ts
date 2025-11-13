import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createWaterRight,
  type WaterRight,
} from '@/lib/onchain-farm-water-rights-management-utils';

export function useOnchainFarmWaterRightsManagement() {
  const { address } = useAccount();
  const [rights, setRights] = useState<WaterRight[]>([]);

  const create = async (
    volume: bigint,
    expiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const right = createWaterRight(address, volume, expiryDate);
    setRights([...rights, right]);
  };

  return { rights, create, address };
}
