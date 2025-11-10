import { type Address } from 'viem';

export interface WaterQualityTest {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  pH: number;
  turbidity: number;
  dissolvedOxygen: number;
  testDate: bigint;
  status: 'safe' | 'unsafe' | 'marginal';
  txHash: string;
}

export function recordWaterQualityTest(
  owner: Address,
  plantationId: bigint,
  pH: number,
  turbidity: number,
  dissolvedOxygen: number
): WaterQualityTest {
  const status: WaterQualityTest['status'] = 
    pH >= 6.5 && pH <= 8.5 && turbidity < 1 && dissolvedOxygen >= 6
      ? 'safe'
      : pH >= 6 && pH <= 9 && turbidity < 5 && dissolvedOxygen >= 4
      ? 'marginal'
      : 'unsafe';
  
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    pH,
    turbidity,
    dissolvedOxygen,
    testDate: BigInt(Date.now()),
    status,
    txHash: '',
  };
}
