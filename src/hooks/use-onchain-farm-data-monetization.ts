import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDataListing,
  type DataListing,
} from '@/lib/onchain-farm-data-monetization-utils';

export function useOnchainFarmDataMonetization() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<DataListing[]>([]);

  const listData = async (
    contractAddress: Address,
    dataType: string,
    price: bigint,
    metadata: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const listing = createDataListing(address, dataType, price, metadata);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'dataType', type: 'string' },
            { name: 'price', type: 'uint256' },
            { name: 'metadata', type: 'string' }
          ],
          name: 'listData',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'listData',
      args: [dataType, price, metadata],
    });
    
    setListings([...listings, listing]);
  };

  const purchaseData = async (
    contractAddress: Address,
    listingId: bigint,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'listingId', type: 'uint256' }],
          name: 'purchaseData',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'purchaseData',
      args: [listingId],
      value,
    });
  };

  return { listings, listData, purchaseData, address };
}
