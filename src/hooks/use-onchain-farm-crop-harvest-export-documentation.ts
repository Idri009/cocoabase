import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createExportDocument,
  type ExportDocument,
} from '@/lib/onchain-farm-crop-harvest-export-documentation-utils';

/**
 * Hook for onchain farm crop harvest export documentation
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestExportDocumentation() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [documents, setDocuments] = useState<ExportDocument[]>([]);

  const createDocument = async (
    harvestId: string,
    documentType: string,
    destinationCountry: string,
    documentNumber: string,
    issueDate: bigint,
    issuingAuthority: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const document = createExportDocument(address, harvestId, documentType, destinationCountry, documentNumber, issueDate, issuingAuthority);
    setDocuments([...documents, document]);
  };

  const verifyDocument = async (
    contractAddress: Address,
    documentId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyDocument',
      args: [documentId],
    });
  };

  return { documents, createDocument, verifyDocument, address };
}

