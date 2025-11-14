import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMigrationRecord,
  type MigrationRecord,
} from '@/lib/onchain-farm-crop-harvest-blockchain-migration-utils';

/**
 * Hook for onchain farm crop harvest blockchain migration
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainMigration() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<MigrationRecord[]>([]);

  const migrate = async (
    harvestId: string,
    fromChain: string,
    toChain: string,
    migrationDate: bigint,
    migrationHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createMigrationRecord(address, harvestId, fromChain, toChain, migrationDate, migrationHash);
    setRecords([...records, record]);
  };

  const verifyMigration = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyMigration',
      args: [recordId],
    });
  };

  return { records, migrate, verifyMigration, address };
}

