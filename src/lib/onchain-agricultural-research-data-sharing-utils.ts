import { type Address } from 'viem';

export interface ResearchData {
  id: bigint;
  owner: Address;
  dataType: string;
  accessLevel: 'public' | 'private' | 'restricted';
  hash: string;
}

export function createResearchData(
  owner: Address,
  dataType: string,
  accessLevel: 'public' | 'private' | 'restricted',
  hash: string
): ResearchData {
  return {
    id: BigInt(0),
    owner,
    dataType,
    accessLevel,
    hash,
  };
}
