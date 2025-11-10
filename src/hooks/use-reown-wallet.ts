import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { type ReownWalletSession } from '@/lib/reown-wallet-utils';
import {
  formatReownAddress,
  isValidReownSession,
  getReownWalletName,
} from '@/lib/reown-wallet-utils';

/**
 * Hook for Reown wallet integration
 * Manages Reown wallet connection and session
 */
export function useReownWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [session, setSession] = useState<ReownWalletSession | null>(null);

  useEffect(() => {
    if (isConnected && address && chainId) {
      setSession({
        address,
        chainId,
        connected: true,
      });
    } else {
      setSession(null);
    }
  }, [isConnected, address, chainId]);

  const connectReown = () => {
    const reownConnector = connectors.find(c => 
      c.name.toLowerCase().includes('reown') || 
      c.name.toLowerCase().includes('walletconnect')
    );
    if (reownConnector) {
      connect({ connector: reownConnector });
    }
  };

  return {
    session: session && isValidReownSession(session) ? session : null,
    isConnected: isConnected && !!session,
    address: address ? formatReownAddress(address) : null,
    walletName: address ? getReownWalletName(address) : null,
    connectReown,
    disconnect,
  };
}

