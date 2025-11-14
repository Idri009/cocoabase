import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSmartContractRecord,
  type SmartContractRecord,
} from '@/lib/onchain-farm-crop-harvest-smart-contract-utils';

/**
 * Hook for onchain farm crop harvest smart contract
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestSmartContract() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<SmartContractRecord[]>([]);

  const createContractRecord = async (
    harvestId: string,
    contractAddress: Address,
    contractType: string,
    deploymentDate: bigint,
    contractHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createSmartContractRecord(address, harvestId, contractAddress, contractType, deploymentDate, contractHash);
    setRecords([...records, record]);
  };

  const executeContract = async (
    contractAddress: Address,
    recordId: string,
    functionName: string,
    args: unknown[]
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName,
      args,
    });
  };

  return { records, createContractRecord, executeContract, address };
}

