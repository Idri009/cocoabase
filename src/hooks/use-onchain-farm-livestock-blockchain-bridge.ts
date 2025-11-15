import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBridgeRecord,
  type BridgeRecord,
} from '@/lib/onchain-farm-livestock-blockchain-bridge-utils';

/**
 * Hook for onchain farm livestock blockchain bridge
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainBridge() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<BridgeRecord[]>([]);

  const bridge = async (
    animalId: string,
    sourceChain: string,
    targetChain: string,
    bridgeDate: bigint,
    bridgeAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createBridgeRecord(address, animalId, sourceChain, targetChain, bridgeDate, bridgeAmount);
    setRecords([...records, record]);
  };

  const completeBridge = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'completeBridge',
      args: [recordId],
    });
  };

  return { records, bridge, completeBridge, address };
}



