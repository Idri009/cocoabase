import { type Address } from 'viem';

export interface LandValuation {
  id: bigint;
  owner: Address;
  landParcelId: bigint;
  valuationAmount: bigint;
  valuationDate: bigint;
  appraiser: Address;
  factors: string;
  txHash: string;
}

export function createValuation(
  owner: Address,
  landParcelId: bigint,
  valuationAmount: bigint,
  appraiser: Address,
  factors: string
): LandValuation {
  return {
    id: BigInt(Date.now()),
    owner,
    landParcelId,
    valuationAmount,
    valuationDate: BigInt(Date.now()),
    appraiser,
    factors,
    txHash: '',
  };
}
