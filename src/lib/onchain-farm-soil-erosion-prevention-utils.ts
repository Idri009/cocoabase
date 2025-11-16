import { type Address } from 'viem';

export interface ErosionAssessment {
  id: string;
  fieldId: bigint;
  erosionRate: bigint;
  soilLoss: bigint;
  slopeAngle: bigint;
  assessor: Address;
}

export function createErosionAssessment(
  address: Address,
  fieldId: bigint,
  erosionRate: bigint,
  soilLoss: bigint,
  slopeAngle: bigint
): ErosionAssessment {
  return {
    id: `${Date.now()}-${Math.random()}`,
    fieldId,
    erosionRate,
    soilLoss,
    slopeAngle,
    assessor: address,
  };
}



