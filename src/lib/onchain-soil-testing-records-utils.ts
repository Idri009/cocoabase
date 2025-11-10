import { type Address } from 'viem';

export interface SoilTestRecord {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  testDate: bigint;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  txHash: string;
}

export function recordSoilTest(
  owner: Address,
  plantationId: bigint,
  pH: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number
): SoilTestRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    testDate: BigInt(Date.now()),
    pH,
    nitrogen,
    phosphorus,
    potassium,
    txHash: '',
  };
}

export function getRecentSoilTests(
  records: SoilTestRecord[],
  days: number
): SoilTestRecord[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.testDate >= cutoff);
}

export function calculateAverageNutrients(
  records: SoilTestRecord[]
): { nitrogen: number; phosphorus: number; potassium: number } {
  if (records.length === 0) return { nitrogen: 0, phosphorus: 0, potassium: 0 };
  const total = records.reduce(
    (acc, r) => ({
      nitrogen: acc.nitrogen + r.nitrogen,
      phosphorus: acc.phosphorus + r.phosphorus,
      potassium: acc.potassium + r.potassium,
    }),
    { nitrogen: 0, phosphorus: 0, potassium: 0 }
  );
  return {
    nitrogen: total.nitrogen / records.length,
    phosphorus: total.phosphorus / records.length,
    potassium: total.potassium / records.length,
  };
}
