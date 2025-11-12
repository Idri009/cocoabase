import { type Address } from 'viem';

export interface Contract {
  id: bigint;
  owner: Address;
  contractType: string;
  counterparty: Address;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'expired' | 'terminated';
  txHash: string;
}

export function createContract(
  owner: Address,
  contractType: string,
  counterparty: Address,
  endDate: bigint
): Contract {
  return {
    id: BigInt(Date.now()),
    owner,
    contractType,
    counterparty,
    startDate: BigInt(Date.now()),
    endDate,
    status: 'active',
    txHash: '',
  };
}

export function terminateContract(
  contract: Contract
): Contract {
  return {
    ...contract,
    status: 'terminated',
  };
}

export function getActiveContracts(
  contracts: Contract[]
): Contract[] {
  return contracts.filter((c) => c.status === 'active');
}

export function checkContractExpiry(
  contract: Contract,
  currentTime: bigint
): boolean {
  return currentTime > contract.endDate;
}
