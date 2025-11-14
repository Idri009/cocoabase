import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCustodyRecord,
  type CustodyRecord,
} from '@/lib/onchain-farm-livestock-blockchain-custody-utils';

/**
 * Hook for onchain farm livestock blockchain custody
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainCustody() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<CustodyRecord[]>([]);

  const transferCustody = async (
    animalId: string,
    fromOwner: Address,
    toOwner: Address,
    transferDate: bigint,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createCustodyRecord(address, animalId, fromOwner, toOwner, transferDate, reason);
    setRecords([...records, record]);
  };

  const verifyCustody = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyCustody',
      args: [recordId],
    });
  };

  return { records, transferCustody, verifyCustody, address };
}

