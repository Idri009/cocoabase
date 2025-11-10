import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createPermission,
  grantPermission,
  revokePermission,
  hasPermission,
  type Permission,
} from '@/lib/onchain-permissions-utils';

export function useOnchainPermissions() {
  const { address } = useAccount();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const grantNewPermission = (
    grantee: Address,
    contract: Address,
    functionName: string
  ) => {
    const permission = createPermission(grantee, contract, functionName, true);
    setPermissions((prev) => [...prev, permission]);
    console.log('Granting permission:', permission);
  };

  return {
    permissions,
    grantNewPermission,
    grantPermission,
    revokePermission,
    hasPermission,
    address,
  };
}

