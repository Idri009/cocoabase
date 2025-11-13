import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createExportLicense,
  type ExportLicense,
} from '@/lib/onchain-agricultural-export-licensing-utils';

export function useOnchainAgriculturalExportLicensing() {
  const { address } = useAccount();
  const [licenses, setLicenses] = useState<ExportLicense[]>([]);

  const create = async (
    commodity: string,
    destination: string,
    expiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const license = createExportLicense(address, commodity, destination, expiryDate);
    setLicenses([...licenses, license]);
  };

  return { licenses, create, address };
}
