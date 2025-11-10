import { type Address } from 'viem';

export interface SoilMoistureReading {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  moistureLevel: number;
  readingDate: bigint;
  sensorId: string;
  txHash: string;
}

export function recordSoilMoisture(
  owner: Address,
  plantationId: bigint,
  moistureLevel: number,
  sensorId: string
): SoilMoistureReading {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    moistureLevel,
    readingDate: BigInt(Date.now()),
    sensorId,
    txHash: '',
  };
}

export function getRecentReadings(
  readings: SoilMoistureReading[],
  days: number
): SoilMoistureReading[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return readings.filter((r) => r.readingDate >= cutoff);
}

export function calculateAverageMoisture(
  readings: SoilMoistureReading[]
): number {
  if (readings.length === 0) return 0;
  const total = readings.reduce((sum, r) => sum + r.moistureLevel, 0);
  return total / readings.length;
}

export function getLowMoistureReadings(
  readings: SoilMoistureReading[],
  threshold: number
): SoilMoistureReading[] {
  return readings.filter((r) => r.moistureLevel < threshold);
}
