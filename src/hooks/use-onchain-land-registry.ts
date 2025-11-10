import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  registerLand,
  transferLand,
  type LandParcel,
} from '@/lib/onchain-land-registry-utils';

export function useOnchainLandRegistry() {
  const { address } = useAccount();
  const [parcels, setParcels] = useState<LandParcel[]>([]);

  const registerNewLand = async (
    coordinates: { latitude: number; longitude: number },
    area: bigint,
    title: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const parcel = registerLand(address, coordinates, area, title);
    setParcels([...parcels, parcel]);
  };

  const transferLandParcel = async (
    parcelId: bigint,
    newOwner: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const parcel = parcels.find((p) => p.id === parcelId);
    if (!parcel) throw new Error('Land parcel not found');
    const updated = transferLand(parcel, newOwner, address);
    if (updated) {
      setParcels(parcels.map((p) => (p.id === parcelId ? updated : p)));
    }
  };

  return {
    parcels,
    registerNewLand,
    transferLandParcel,
    address,
  };
}
