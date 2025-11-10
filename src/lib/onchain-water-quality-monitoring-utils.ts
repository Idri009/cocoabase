import { type Address } from 'viem';

/**
 * Onchain Water Quality Monitoring utilities
 * Monitor water quality onchain
 */

export interface WaterQualityRecord {
  id: bigint;
  recorder: Address;
  location: string;
  pH: number;
  turbidity: number;
  dissolvedOxygen: number;
  temperature: number;
  contaminationLevel: number;
  status: 'safe' | 'warning' | 'unsafe';
  timestamp: bigint;
}

export function createWaterQualityRecord(
  recorder: Address,
  location: string,
  pH: number,
  turbidity: number,
  dissolvedOxygen: number,
  temperature: number,
  contaminationLevel: number
): WaterQualityRecord {
  const now = BigInt(Date.now());
  const status = determineWaterStatus(pH, turbidity, dissolvedOxygen, contaminationLevel);
  return {
    id: BigInt(0),
    recorder,
    location,
    pH,
    turbidity,
    dissolvedOxygen,
    temperature,
    contaminationLevel,
    status,
    timestamp: now,
  };
}

export function determineWaterStatus(
  pH: number,
  turbidity: number,
  dissolvedOxygen: number,
  contaminationLevel: number
): 'safe' | 'warning' | 'unsafe' {
  if (contaminationLevel > 50) return 'unsafe';
  if (pH < 6 || pH > 8.5) return 'warning';
  if (turbidity > 5) return 'warning';
  if (dissolvedOxygen < 5) return 'warning';
  if (contaminationLevel > 30) return 'warning';
  return 'safe';
}

export function calculateWaterQualityScore(record: WaterQualityRecord): number {
  let score = 100;
  if (record.pH < 6 || record.pH > 8.5) score -= 20;
  if (record.turbidity > 5) score -= 15;
  if (record.dissolvedOxygen < 5) score -= 25;
  score -= record.contaminationLevel;
  return Math.max(0, score);
}

export function getWaterQualityTrend(
  records: WaterQualityRecord[]
): 'improving' | 'stable' | 'deteriorating' {
  if (records.length < 2) return 'stable';
  const recent = records.slice(-3);
  const older = records.slice(-6, -3);
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, r) => sum + calculateWaterQualityScore(r), 0) / recent.length;
  const olderAvg = older.reduce((sum, r) => sum + calculateWaterQualityScore(r), 0) / older.length;
  
  if (recentAvg > olderAvg + 5) return 'improving';
  if (recentAvg < olderAvg - 5) return 'deteriorating';
  return 'stable';
}

