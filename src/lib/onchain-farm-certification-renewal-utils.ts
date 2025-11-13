import { type Address } from 'viem';

export interface Certification {
  id: string;
  certId: bigint;
  holder: Address;
  certType: string;
  issueDate: bigint;
  expiryDate: bigint;
  active: boolean;
  renewalCount: bigint;
}

export function createCertification(
  holder: Address,
  certId: bigint,
  certType: string,
  validityPeriod: bigint
): Certification {
  return {
    id: `${Date.now()}-${Math.random()}`,
    certId,
    holder,
    certType,
    issueDate: BigInt(Date.now()),
    expiryDate: BigInt(Date.now()) + validityPeriod,
    active: true,
    renewalCount: BigInt(0),
  };
}
