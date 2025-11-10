import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTraceabilityRecord,
  advanceTraceabilityStage,
  getTraceabilityChain,
  verifyTraceabilityChain,
  calculateTraceabilityScore,
  type TraceabilityRecord,
} from '@/lib/onchain-farm-to-table-traceability-utils';

/**
 * Hook for onchain farm-to-table traceability operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainFarmToTableTraceability() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<TraceabilityRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const recordTraceabilityEvent = async (
    productId: string,
    stage: TraceabilityRecord['stage'],
    location: string,
    metadata: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRecording(true);
    try {
      const record = createTraceabilityRecord(
        productId,
        stage,
        location,
        address,
        metadata
      );
      setRecords((prev) => [...prev, record]);
      console.log('Recording traceability event:', record);
      // Onchain recording via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'recordTraceabilityEvent',
        args: [productId, stage, location, metadata],
      });
    } finally {
      setIsRecording(false);
    }
  };

  const advanceToNextStage = async (
    productId: string,
    newStage: TraceabilityRecord['stage'],
    location: string,
    metadata: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRecording(true);
    try {
      const chain = getTraceabilityChain(records, productId);
      if (chain.length === 0) throw new Error('No traceability records found');
      const lastRecord = chain[chain.length - 1];
      const newRecord = advanceTraceabilityStage(
        lastRecord,
        newStage,
        location,
        address,
        metadata
      );
      setRecords((prev) => [...prev, newRecord]);
      console.log('Advancing to next stage:', newRecord);
      // Onchain advancement via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'advanceTraceabilityStage',
        args: [productId, newStage, location, metadata],
      });
    } finally {
      setIsRecording(false);
    }
  };

  return {
    records,
    recordTraceabilityEvent,
    advanceToNextStage,
    getTraceabilityChain,
    verifyTraceabilityChain,
    calculateTraceabilityScore,
    isRecording,
    address,
  };
}

