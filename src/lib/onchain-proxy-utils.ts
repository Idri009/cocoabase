import { type Address } from 'viem';

export interface ProxyContract {
  id: bigint;
  owner: Address;
  implementation: Address;
  proxyType: 'transparent' | 'uups' | 'beacon';
  upgraded: boolean;
}

export function createProxy(
  owner: Address,
  implementation: Address,
  proxyType: 'transparent' | 'uups' | 'beacon'
): ProxyContract {
  return {
    id: BigInt(0),
    owner,
    implementation,
    proxyType,
    upgraded: false,
  };
}

export function upgradeProxy(
  proxy: ProxyContract,
  newImplementation: Address
): ProxyContract {
  return {
    ...proxy,
    implementation: newImplementation,
    upgraded: true,
  };
}

export function isValidProxyType(
  type: string
): type is 'transparent' | 'uups' | 'beacon' {
  return ['transparent', 'uups', 'beacon'].includes(type);
}
