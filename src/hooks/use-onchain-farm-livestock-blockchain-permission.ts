import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPermission,
  type Permission,
} from '@/lib/onchain-farm-livestock-blockchain-permission-utils';

/**
 * Hook for onchain farm livestock blockchain permission
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainPermission() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const grantPermission = async (
    animalId: string,
    grantee: Address,
    permissionType: string,
    grantDate: bigint,
    expiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const permission = createPermission(address, animalId, grantee, permissionType, grantDate, expiryDate);
    setPermissions([...permissions, permission]);
  };

  const revokePermission = async (
    contractAddress: Address,
    permissionId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'revokePermission',
      args: [permissionId],
    });
  };

  return { permissions, grantPermission, revokePermission, address };
}

