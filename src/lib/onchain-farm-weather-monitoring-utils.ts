import { type Address } from 'viem';

export interface WeatherRecord {
  id: string;
  recordId: bigint;
  plantationId: bigint;
  temperature: bigint;
  humidity: bigint;
  rainfall: bigint;
  recordDate: bigint;
  recorder: Address;
}

export function createWeatherRecord(
  address: Address,
  plantationId: bigint,
  temperature: bigint,
  humidity: bigint,
  rainfall: bigint
): WeatherRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId: BigInt(0),
    plantationId,
    temperature,
    humidity,
    rainfall,
    recordDate: BigInt(Date.now()),
    recorder: address,
  };
}

