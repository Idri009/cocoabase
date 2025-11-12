import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createExportDocument,
  approveDocument,
  getPendingDocuments,
  getDocumentsByDestination,
  type ExportDocument,
} from '@/lib/onchain-agricultural-export-documentation-utils';

export function useOnchainAgriculturalExportDocumentation() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [documents, setDocuments] = useState<ExportDocument[]>([]);
  const [isApproving, setIsApproving] = useState(false);

  const approve = async (documentId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsApproving(true);
    try {
      const document = documents.find((d) => d.id === documentId);
      if (!document) throw new Error('Document not found');
      const updated = approveDocument(document, address);
      console.log('Approving document:', { documentId });
    } finally {
      setIsApproving(false);
    }
  };

  return {
    documents,
    approve,
    getPendingDocuments,
    getDocumentsByDestination,
    isApproving,
    address,
  };
}
