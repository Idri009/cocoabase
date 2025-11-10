import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBatchTransaction,
  estimateBatchGas,
  executeBatch,
  type BatchTransaction,
  type Transaction,
} from '@/lib/onchain-batch-utils';

export function useOnchainBatch() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [batches, setBatches] = useState<BatchTransaction[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const createBatch = async (transactions: Transaction[]): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsExecuting(true);
    try {
      const batch = createBatchTransaction(address, transactions);
      console.log('Creating batch transaction:', batch);
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    batches,
    createBatch,
    estimateBatchGas,
    executeBatch,
    isExecuting,
    address,
  };
}

