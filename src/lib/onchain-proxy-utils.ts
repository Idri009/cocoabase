import { type Address } from 'viem';

/**
 * Onchain proxy utilities
 * Proxy contracts and upgradeable contracts
 */

export interface ProxyContract {
  proxy: Address;
  implementation: Address;
  admin: Address;
}

/**
 * Check if address is proxy
 */
export function isProxyContract(proxy: ProxyContract): boolean {
  return proxy.proxy !== proxy.implementation;
}

