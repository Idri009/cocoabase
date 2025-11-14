import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createAccessControl,
  type AccessControl,
} from '@/lib/onchain-farm-livestock-blockchain-access-control-utils';

/**
 * Hook for onchain farm livestock blockchain access control
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainAccessControl() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [controls, setControls] = useState<AccessControl[]>([]);

  const grantAccess = async (
    animalId: string,
    user: Address,
    role: string,
    grantDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const control = createAccessControl(address, animalId, user, role, grantDate);
    setControls([...controls, control]);
  };

  const revokeAccess = async (
    contractAddress: Address,
    controlId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'revokeAccess',
      args: [controlId],
    });
  };

  return { controls, grantAccess, revokeAccess, address };
}

