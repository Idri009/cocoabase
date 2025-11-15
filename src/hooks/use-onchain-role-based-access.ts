import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createRole,
  grantRole,
  revokeRole,
  hasRole,
  type Role,
} from '@/lib/onchain-role-based-access-utils';

export function useOnchainRoleBasedAccess() {
  const { address } = useAccount();
  const [roles, setRoles] = useState<Role[]>([]);

  const grant = (roleId: bigint, addressToGrant: Address) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const role = roles.find((r) => r.id === roleId);
    if (!role) throw new Error('Role not found');
    const updated = grantRole(role, addressToGrant);
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? updated : r))
    );
    console.log('Granting role:', { roleId, addressToGrant });
  };

  return {
    roles,
    grant,
    revokeRole,
    hasRole,
    address,
  };
}



