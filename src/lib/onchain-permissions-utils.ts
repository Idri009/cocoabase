import { type Address } from 'viem';

export interface Permission {
  id: string;
  grantee: Address;
  contract: Address;
  function: string;
  allowed: boolean;
}

export function createPermission(
  grantee: Address,
  contract: Address,
  functionName: string,
  allowed: boolean
): Permission {
  return {
    id: `${contract}-${grantee}-${functionName}`,
    grantee,
    contract,
    function: functionName,
    allowed,
  };
}

export function grantPermission(permission: Permission): Permission {
  return { ...permission, allowed: true };
}

export function revokePermission(permission: Permission): Permission {
  return { ...permission, allowed: false };
}

export function hasPermission(
  permissions: Permission[],
  grantee: Address,
  contract: Address,
  functionName: string
): boolean {
  const permission = permissions.find(
    (p) =>
      p.grantee === grantee &&
      p.contract === contract &&
      p.function === functionName
  );
  return permission?.allowed || false;
}
