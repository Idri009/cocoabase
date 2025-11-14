import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createZKProof,
  type ZKProof,
} from '@/lib/onchain-farm-crop-harvest-blockchain-zkproof-utils';

/**
 * Hook for onchain farm crop harvest blockchain zero-knowledge proof
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainZKProof() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [proofs, setProofs] = useState<ZKProof[]>([]);

  const generateProof = async (
    harvestId: string,
    proofType: string,
    proofData: string,
    publicInputs: string[],
    proofDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const proof = createZKProof(address, harvestId, proofType, proofData, publicInputs, proofDate);
    setProofs([...proofs, proof]);
  };

  const verifyProof = async (
    contractAddress: Address,
    proofId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyProof',
      args: [proofId],
    });
  };

  return { proofs, generateProof, verifyProof, address };
}

