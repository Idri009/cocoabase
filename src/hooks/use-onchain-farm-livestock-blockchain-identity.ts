import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBlockchainIdentity,
  type BlockchainIdentity,
} from '@/lib/onchain-farm-livestock-blockchain-identity-utils';

/**
 * Hook for onchain farm livestock blockchain identity
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainIdentity() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [identities, setIdentities] = useState<BlockchainIdentity[]>([]);

  const createIdentity = async (
    animalId: string,
    identityHash: string,
    metadata: string,
    registrationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const identity = createBlockchainIdentity(address, animalId, identityHash, metadata, registrationDate);
    setIdentities([...identities, identity]);
  };

  const updateIdentity = async (
    contractAddress: Address,
    identityId: string,
    newMetadata: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateIdentity',
      args: [identityId, newMetadata],
    });
  };

  return { identities, createIdentity, updateIdentity, address };
}

