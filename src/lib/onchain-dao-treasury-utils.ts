import { type Address } from 'viem';

export interface DAOTreasury {
  id: bigint;
  dao: Address;
  tokens: Map<Address, bigint>;
  proposals: bigint[];
}

export function createDAOTreasury(dao: Address): DAOTreasury {
  return {
    id: BigInt(0),
    dao,
    tokens: new Map(),
    proposals: [],
  };
}

