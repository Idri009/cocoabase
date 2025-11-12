import { type Address } from 'viem';

export interface ExportDocument {
  id: bigint;
  creator: Address;
  destination: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function createExportDocument(
  creator: Address,
  destination: string,
  documentType: string
): ExportDocument {
  return {
    id: BigInt(0),
    creator,
    destination,
    documentType,
    status: 'pending',
  };
}

export function approveDocument(
  document: ExportDocument,
  approver: Address
): ExportDocument {
  return {
    ...document,
    status: 'approved',
  };
}

export function getPendingDocuments(
  documents: ExportDocument[]
): ExportDocument[] {
  return documents.filter((d) => d.status === 'pending');
}

export function getDocumentsByDestination(
  documents: ExportDocument[],
  destination: string
): ExportDocument[] {
  return documents.filter((d) => d.destination === destination);
}
