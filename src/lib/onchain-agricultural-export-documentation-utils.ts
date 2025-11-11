import { type Address } from 'viem';

export interface ExportDocument {
  id: bigint;
  owner: Address;
  productId: bigint;
  destination: string;
  documentType: string;
  documentHash: string;
  issuedDate: bigint;
  status: 'pending' | 'approved' | 'rejected';
  txHash: string;
}

export function createExportDocument(
  owner: Address,
  productId: bigint,
  destination: string,
  documentType: string,
  documentHash: string
): ExportDocument {
  return {
    id: BigInt(Date.now()),
    owner,
    productId,
    destination,
    documentType,
    documentHash,
    issuedDate: BigInt(Date.now()),
    status: 'pending',
    txHash: '',
  };
}

export function approveExportDocument(
  document: ExportDocument
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
