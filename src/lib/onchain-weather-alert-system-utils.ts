import { type Address } from 'viem';

export interface WeatherAlert {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  alertType: 'rain' | 'storm' | 'drought' | 'frost' | 'heat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  alertDate: bigint;
  status: 'active' | 'acknowledged' | 'resolved';
  txHash: string;
}

export function createWeatherAlert(
  owner: Address,
  plantationId: bigint,
  alertType: WeatherAlert['alertType'],
  severity: WeatherAlert['severity'],
  alertDate: bigint
): WeatherAlert {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    alertType,
    severity,
    alertDate,
    status: 'active',
    txHash: '',
  };
}
