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
