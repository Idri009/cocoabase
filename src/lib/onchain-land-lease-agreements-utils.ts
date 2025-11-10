import { type Address } from 'viem';

export interface LandLeaseAgreement {
  id: bigint;
  lessor: Address;
  lessee: Address;
  landParcelId: bigint;
  monthlyRent: bigint;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'expired' | 'cancelled';
  txHash: string;
}

export function createLandLease(
  lessor: Address,
  lessee: Address,
  landParcelId: bigint,
  monthlyRent: bigint,
  startDate: bigint,
  endDate: bigint
): LandLeaseAgreement {
  return {
    id: BigInt(Date.now()),
    lessor,
    lessee,
    landParcelId,
    monthlyRent,
    startDate,
    endDate,
    status: 'active',
    txHash: '',
  };
}
