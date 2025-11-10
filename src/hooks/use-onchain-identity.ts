import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  type Identity,
} from '@/lib/onchain-identity-utils';

export function useOnchainIdentity() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [identities, setIdentities] = useState<Identity[]>([]);

  const createIdentity = async (
    credentials: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'createIdentity',
      args: [credentials],
    });
  };

  return { identities, createIdentity, address };
}
