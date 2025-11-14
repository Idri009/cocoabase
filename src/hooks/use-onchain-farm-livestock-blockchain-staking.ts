import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStakingRecord,
  type StakingRecord,
} from '@/lib/onchain-farm-livestock-blockchain-staking-utils';

/**
 * Hook for onchain farm livestock blockchain staking
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainStaking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<StakingRecord[]>([]);

  const stake = async (
    animalId: string,
    amount: bigint,
    stakingPeriod: number,
    stakingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createStakingRecord(address, animalId, amount, stakingPeriod, stakingDate);
    setRecords([...records, record]);
  };

  const unstake = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'unstake',
      args: [recordId],
    });
  };

  return { records, stake, unstake, address };
}

