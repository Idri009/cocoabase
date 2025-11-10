import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  type Option,
} from '@/lib/onchain-options-utils';

export function useOnchainOptions() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [options, setOptions] = useState<Option[]>([]);

  const purchaseOption = async (
    underlying: Address,
    strikePrice: bigint,
    expiry: bigint,
    type: 'call' | 'put'
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'purchaseOption',
      args: [underlying, strikePrice, expiry, type],
    });
  };

  return { options, purchaseOption, address };
}
