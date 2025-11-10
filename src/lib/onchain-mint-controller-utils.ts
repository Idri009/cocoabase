import { type Address } from 'viem';

export interface MintController {
  id: bigint;
  token: Address;
  minter: Address;
  maxSupply: bigint;
  currentSupply: bigint;
  mintCap: bigint;
}

export function createMintController(
  token: Address,
  minter: Address,
  maxSupply: bigint,
  mintCap: bigint
): MintController {
  return {
    id: BigInt(0),
    token,
    minter,
    maxSupply,
    currentSupply: BigInt(0),
    mintCap,
  };
}

