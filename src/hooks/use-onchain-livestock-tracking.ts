import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  registerLivestock,
  type Livestock,
} from '@/lib/onchain-livestock-tracking-utils';

export function useOnchainLivestockTracking() {
  const { address } = useAccount();
  const [livestock, setLivestock] = useState<Livestock[]>([]);

  const register = async (
    animalType: string,
    tagNumber: string,
    birthDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const animal = registerLivestock(address, animalType, tagNumber, birthDate);
    setLivestock([...livestock, animal]);
  };

  return { livestock, register, address };
}
