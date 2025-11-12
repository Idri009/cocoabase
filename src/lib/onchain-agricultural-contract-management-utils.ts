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
