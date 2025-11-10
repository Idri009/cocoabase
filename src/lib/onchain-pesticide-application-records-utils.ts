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
