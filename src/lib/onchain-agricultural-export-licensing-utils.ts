import { type Address } from 'viem';

export interface ExportLicense {
  id: bigint;
  applicant: Address;
  commodity: string;
  destination: string;
  expiryDate: bigint;
  status: 'pending' | 'approved' | 'expired';
  timestamp: bigint;
}

export function createExportLicense(
  applicant: Address,
  commodity: string,
  destination: string,
  expiryDate: bigint
): ExportLicense {
  return {
    id: BigInt(Date.now()),
    applicant,
    commodity,
    destination,
    expiryDate,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}
