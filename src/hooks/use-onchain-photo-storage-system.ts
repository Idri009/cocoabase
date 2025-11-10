import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  storePhoto,
  type Photo,
} from '@/lib/onchain-photo-storage-system-utils';

export function useOnchainPhotoStorageSystem() {
  const { address } = useAccount();
  const [photos, setPhotos] = useState<Photo[]>([]);

  const store = async (
    plantationId: bigint,
    photoHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const photo = storePhoto(address, plantationId, photoHash);
    setPhotos([...photos, photo]);
  };

  return { photos, store, address };
}
