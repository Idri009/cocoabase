import { type Address } from 'viem';

export interface Photo {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  photoHash: string;
  uploadedDate: bigint;
  txHash: string;
}

export function storePhoto(
  owner: Address,
  plantationId: bigint,
  photoHash: string
): Photo {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    photoHash,
    uploadedDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getPhotosByPlantation(
  photos: Photo[],
  plantationId: bigint
): Photo[] {
  return photos
    .filter((p) => p.plantationId === plantationId)
    .sort((a, b) => (a.uploadedDate > b.uploadedDate ? -1 : 1));
}

export function getRecentPhotos(
  photos: Photo[],
  days: number
): Photo[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return photos.filter((p) => p.uploadedDate >= cutoff);
}
