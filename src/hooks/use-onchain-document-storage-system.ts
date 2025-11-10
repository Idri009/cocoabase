import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  storeDocument,
  type Document,
} from '@/lib/onchain-document-storage-system-utils';

export function useOnchainDocumentStorageSystem() {
  const { address } = useAccount();
  const [documents, setDocuments] = useState<Document[]>([]);

  const store = async (
    documentType: string,
    documentHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const document = storeDocument(address, documentType, documentHash);
    setDocuments([...documents, document]);
  };

  return { documents, store, address };
}
