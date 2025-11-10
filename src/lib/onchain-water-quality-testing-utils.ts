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

export function getSafeWaterTests(
  tests: WaterQualityTest[]
): WaterQualityTest[] {
  return tests.filter((t) => t.status === 'safe');
}

export function getUnsafeWaterTests(
  tests: WaterQualityTest[]
): WaterQualityTest[] {
  return tests.filter((t) => t.status === 'unsafe');
}

export function getRecentTests(
  tests: WaterQualityTest[],
  days: number
): WaterQualityTest[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return tests.filter((t) => t.testDate >= cutoff);
}

export function calculateAverageQuality(
  tests: WaterQualityTest[]
): { pH: number; turbidity: number; dissolvedOxygen: number } {
  if (tests.length === 0) return { pH: 0, turbidity: 0, dissolvedOxygen: 0 };
  const total = tests.reduce(
    (acc, t) => ({
      pH: acc.pH + t.pH,
      turbidity: acc.turbidity + t.turbidity,
      dissolvedOxygen: acc.dissolvedOxygen + t.dissolvedOxygen,
    }),
    { pH: 0, turbidity: 0, dissolvedOxygen: 0 }
  );
  return {
    pH: total.pH / tests.length,
    turbidity: total.turbidity / tests.length,
    dissolvedOxygen: total.dissolvedOxygen / tests.length,
  };
}
