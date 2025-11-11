import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createExportDocument,
  type ExportDocument,
} from '@/lib/onchain-agricultural-export-documentation-utils';

export function useOnchainAgriculturalExportDocumentation() {
  const { address } = useAccount();
  const [documents, setDocuments] = useState<ExportDocument[]>([]);

  const create = async (
    productId: bigint,
    destination: string,
    documentType: string,
    documentHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const document = createExportDocument(address, productId, destination, documentType, documentHash);
    setDocuments([...documents, document]);
  };

  return { documents, create, address };
}
