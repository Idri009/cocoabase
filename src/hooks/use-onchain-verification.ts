import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createVerification,
  verify,
  revokeVerification,
  isVerified,
  type Verification,
} from '@/lib/onchain-verification-utils';

export function useOnchainVerification() {
  const { address } = useAccount();
  const [verifications, setVerifications] = useState<Verification[]>([]);

  const createNewVerification = (
    subject: Address,
    credential: string
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const verification = createVerification(address, subject, credential);
    setVerifications((prev) => [...prev, verification]);
    console.log('Creating verification:', verification);
  };

  return {
    verifications,
    createNewVerification,
    verify,
    revokeVerification,
    isVerified,
    address,
  };
}

