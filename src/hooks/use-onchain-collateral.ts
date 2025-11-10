import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCollateral,
  type Collateral,
} from '@/lib/onchain-collateral-utils';

export function useOnchainCollateral() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [collaterals, setCollaterals] = useState<Collateral[]>([]);

  const depositCollateral = async (
    asset: Address,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'depositCollateral',
      args: [asset, amount],
    });
  };

  return { collaterals, depositCollateral, address };
}
