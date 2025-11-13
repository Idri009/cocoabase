import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createLaborContract,
  type LaborContract,
} from '@/lib/onchain-farm-labor-contract-management-utils';

export function useOnchainFarmLaborContractManagement() {
  const { address } = useAccount();
  const [contracts, setContracts] = useState<LaborContract[]>([]);

  const create = async (
    worker: Address,
    wage: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const contract = createLaborContract(address, worker, wage, duration);
    setContracts([...contracts, contract]);
  };

  return { contracts, create, address };
}
