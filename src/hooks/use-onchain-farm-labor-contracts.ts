import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLaborContract,
  type LaborContract,
} from '@/lib/onchain-farm-labor-contracts-utils';

/**
 * Hook for onchain farm labor contracts
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLaborContracts() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [contracts, setContracts] = useState<LaborContract[]>([]);

  const createContract = async (
    contractAddress: Address,
    worker: Address,
    startDate: bigint,
    endDate: bigint,
    wagePerDay: bigint,
    role: string,
    terms: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'worker', type: 'address' },
            { name: 'startDate', type: 'uint256' },
            { name: 'endDate', type: 'uint256' },
            { name: 'wagePerDay', type: 'uint256' },
            { name: 'role', type: 'string' },
            { name: 'terms', type: 'string' }
          ],
          name: 'createContract',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createContract',
      args: [worker, startDate, endDate, wagePerDay, role, terms],
    });
  };

  const recordPayment = async (
    contractAddress: Address,
    contractId: bigint,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'contractId', type: 'uint256' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'recordPayment',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordPayment',
      args: [contractId, amount],
    });
  };

  return { 
    contracts, 
    createContract, 
    recordPayment, 
    address 
  };
}

