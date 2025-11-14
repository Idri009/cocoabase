import { type Address } from 'viem';

/**
 * Onchain farm crop harvest export documentation utilities
 * Export document creation on blockchain
 */

export interface ExportDocument {
  id: string;
  harvestId: string;
  createdBy: Address;
  documentType: string;
  destinationCountry: string;
  documentNumber: string;
  issueDate: bigint;
  issuingAuthority: string;
  verified: boolean;
  timestamp: bigint;
}

export function createExportDocument(
  address: Address,
  harvestId: string,
  documentType: string,
  destinationCountry: string,
  documentNumber: string,
  issueDate: bigint,
  issuingAuthority: string
): ExportDocument {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    documentType,
    destinationCountry,
    documentNumber,
    issueDate,
    issuingAuthority,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

