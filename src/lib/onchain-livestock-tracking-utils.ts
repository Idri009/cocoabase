import { type Address } from 'viem';

export interface Livestock {
  id: bigint;
  owner: Address;
  animalType: string;
  tagNumber: string;
  birthDate: bigint;
  status: 'healthy' | 'sick' | 'sold' | 'deceased';
  txHash: string;
}

export function registerLivestock(
  owner: Address,
  animalType: string,
  tagNumber: string,
  birthDate: bigint
): Livestock {
  return {
    id: BigInt(Date.now()),
    owner,
    animalType,
    tagNumber,
    birthDate,
    status: 'healthy',
    txHash: '',
  };
}

export function updateLivestockStatus(
  livestock: Livestock,
  status: Livestock['status']
): Livestock {
  return {
    ...livestock,
    status,
  };
}

export function getHealthyLivestock(
  livestock: Livestock[]
): Livestock[] {
  return livestock.filter((l) => l.status === 'healthy');
}

export function getLivestockByType(
  livestock: Livestock[],
  animalType: string
): Livestock[] {
  return livestock.filter((l) => l.animalType === animalType);
}
