import { type Address } from 'viem';

export interface WeatherData {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  recordedDate: bigint;
  txHash: string;
}

export function recordWeatherData(
  owner: Address,
  plantationId: bigint,
  temperature: number,
  humidity: number,
  rainfall: number,
  windSpeed: number
): WeatherData {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    temperature,
    humidity,
    rainfall,
    windSpeed,
    recordedDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getWeatherByPlantation(
  data: WeatherData[],
  plantationId: bigint
): WeatherData[] {
  return data
    .filter((d) => d.plantationId === plantationId)
    .sort((a, b) => (a.recordedDate > b.recordedDate ? -1 : 1));
}

export function getRecentWeatherData(
  data: WeatherData[],
  days: number
): WeatherData[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return data.filter((d) => d.recordedDate >= cutoff);
}

export function calculateAverageWeather(
  data: WeatherData[]
): { temperature: number; humidity: number; rainfall: number; windSpeed: number } {
  if (data.length === 0) return { temperature: 0, humidity: 0, rainfall: 0, windSpeed: 0 };
  const total = data.reduce(
    (acc, d) => ({
      temperature: acc.temperature + d.temperature,
      humidity: acc.humidity + d.humidity,
      rainfall: acc.rainfall + d.rainfall,
      windSpeed: acc.windSpeed + d.windSpeed,
    }),
    { temperature: 0, humidity: 0, rainfall: 0, windSpeed: 0 }
  );
  return {
    temperature: total.temperature / data.length,
    humidity: total.humidity / data.length,
    rainfall: total.rainfall / data.length,
    windSpeed: total.windSpeed / data.length,
  };
}
