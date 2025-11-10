import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCrossChainBridge,
  startBridge,
  completeBridge,
  calculateBridgeFee,
  type CrossChainBridge,
} from '@/lib/onchain-cross-chain-utils';

export function useOnchainCrossChain() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [bridges, setBridges] = useState<CrossChainBridge[]>([]);
  const [isBridging, setIsBridging] = useState(false);

  const bridge = async (
    sourceChain: number,
    targetChain: number,
    token: Address,
    amount: bigint,
    txHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsBridging(true);
    try {
      const bridge = createCrossChainBridge(
        sourceChain,
        targetChain,
        token,
        amount,
        txHash
      );
      console.log('Creating cross-chain bridge:', bridge);
    } finally {
      setIsBridging(false);
    }
  };

  return {
    bridges,
    bridge,
    startBridge,
    completeBridge,
    calculateBridgeFee,
    isBridging,
    address,
  };
}

