import { type Address } from 'viem';

export interface PesticideApplication {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  pesticideType: string;
  quantity: bigint;
  applicationDate: bigint;
  txHash: string;
}

export function recordPesticideApplication(
  owner: Address,
  plantationId: bigint,
  pesticideType: string,
  quantity: bigint
): PesticideApplication {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    pesticideType,
    quantity,
    applicationDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getApplicationsByType(
  applications: PesticideApplication[],
  pesticideType: string
): PesticideApplication[] {
  return applications.filter((a) => a.pesticideType === pesticideType);
}

export function getTotalPesticideUsed(
  applications: PesticideApplication[],
  plantationId: bigint
): bigint {
  return applications
    .filter((a) => a.plantationId === plantationId)
    .reduce((total, a) => total + a.quantity, BigInt(0));
}

export function getRecentApplications(
  applications: PesticideApplication[],
  days: number
): PesticideApplication[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return applications.filter((a) => a.applicationDate >= cutoff);
}
