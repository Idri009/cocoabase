import { type Address } from 'viem';

export interface FeeCollector {
  id: bigint;
  token: Address;
  totalFees: bigint;
  feeRate: number;
  beneficiaries: Map<Address, number>;
}

export function createFeeCollector(
  token: Address,
  feeRate: number
): FeeCollector {
  return {
    id: BigInt(0),
    token,
    totalFees: BigInt(0),
    feeRate,
    beneficiaries: new Map(),
  };
}

export function collectFee(
  collector: FeeCollector,
  amount: bigint
): FeeCollector {
  const fee = (amount * BigInt(Math.floor(collector.feeRate * 100))) / BigInt(10000);
  return {
    ...collector,
    totalFees: collector.totalFees + fee,
  };
}

export function addBeneficiary(
  collector: FeeCollector,
  beneficiary: Address,
  share: number
): FeeCollector {
  const newBeneficiaries = new Map(collector.beneficiaries);
  newBeneficiaries.set(beneficiary, share);
  return {
    ...collector,
    beneficiaries: newBeneficiaries,
  };
}

export function distributeFees(
  collector: FeeCollector
): Map<Address, bigint> {
  const distribution = new Map<Address, bigint>();
  let totalShare = 0;
  for (const share of collector.beneficiaries.values()) {
    totalShare += share;
  }
  for (const [beneficiary, share] of collector.beneficiaries) {
    const amount = (collector.totalFees * BigInt(Math.floor(share * 100))) / BigInt(Math.floor(totalShare * 100));
    distribution.set(beneficiary, amount);
  }
  return distribution;
}
