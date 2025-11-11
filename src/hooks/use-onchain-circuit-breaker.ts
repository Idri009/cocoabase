import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createCircuitBreaker,
  checkCircuitBreaker,
  resetCircuitBreaker,
  type CircuitBreaker,
} from '@/lib/onchain-circuit-breaker-utils';

export function useOnchainCircuitBreaker() {
  const { address } = useAccount();
  const [breakers, setBreakers] = useState<CircuitBreaker[]>([]);

  const check = (breakerId: bigint, amount: bigint): boolean => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const breaker = breakers.find((b) => b.id === breakerId);
    if (!breaker) throw new Error('Circuit breaker not found');
    const { breaker: updated, allowed } = checkCircuitBreaker(breaker, amount);
    setBreakers((prev) =>
      prev.map((b) => (b.id === breakerId ? updated : b))
    );
    return allowed;
  };

  return {
    breakers,
    check,
    resetCircuitBreaker,
    address,
  };
}

