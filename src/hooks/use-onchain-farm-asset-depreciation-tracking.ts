import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createDepreciationRecord,
  calculateDepreciation,
  getRecordsByAsset,
  calculateTotalDepreciation,
  type DepreciationRecord,
} from '@/lib/onchain-farm-asset-depreciation-tracking-utils';

export function useOnchainFarmAssetDepreciationTracking() {
  const { address } = useAccount();
  const [records, setRecords] = useState<DepreciationRecord[]>([]);

  const record = (
    asset: string,
    initialValue: bigint,
    currentValue: bigint,
    depreciationRate: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const depreciationRecord = createDepreciationRecord(
      address,
      asset,
      initialValue,
      currentValue,
      depreciationRate
    );
    setRecords((prev) => [...prev, depreciationRecord]);
    console.log('Recording depreciation:', { asset, initialValue });
  };

  return {
    records,
    record,
    calculateDepreciation,
    getRecordsByAsset,
    calculateTotalDepreciation,
    address,
  };
}
