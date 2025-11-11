import { type Address } from 'viem';

export interface PreventionPlan {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  diseaseType: string;
  preventionMethod: string;
  scheduledDate: bigint;
  status: 'scheduled' | 'completed' | 'cancelled';
  txHash: string;
}

export function createPreventionPlan(
  owner: Address,
  plantationId: bigint,
  diseaseType: string,
  preventionMethod: string,
  scheduledDate: bigint
): PreventionPlan {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    diseaseType,
    preventionMethod,
    scheduledDate,
    status: 'scheduled',
    txHash: '',
  };
}
