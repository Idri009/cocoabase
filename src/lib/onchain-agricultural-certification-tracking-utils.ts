import { type Address } from 'viem';

export interface Certification {
  id: bigint;
  holder: Address;
  certType: string;
  expiryDate: bigint;
  status: 'active' | 'expired';
  timestamp: bigint;
}

export function createCertification(
  holder: Address,
  certType: string,
  expiryDate: bigint
): Certification {
  return {
    id: BigInt(Date.now()),
    holder,
    certType,
    expiryDate,
    status: 'active',
    timestamp: BigInt(Date.now()),
  };
}

export function getActiveCertifications(
  certifications: Certification[]
): Certification[] {
  return certifications.filter((c) => c.status === 'active');
}

export function checkCertificationExpiry(
  cert: Certification,
  currentTime: bigint
): boolean {
  return currentTime > cert.expiryDate;
}
