import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createProductionMetric,
  getMetricsByPlantation,
  getMetricsByPeriod,
  calculateAverageMetric,
  type ProductionMetric,
} from '@/lib/onchain-farm-production-analytics-utils';

export function useOnchainFarmProductionAnalytics() {
  const { address } = useAccount();
  const [metrics, setMetrics] = useState<ProductionMetric[]>([]);

  const record = (
    plantation: Address,
    metric: string,
    value: bigint,
    period: string
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const productionMetric = createProductionMetric(
      address,
      plantation,
      metric,
      value,
      period
    );
    setMetrics((prev) => [...prev, productionMetric]);
    console.log('Recording production metric:', { plantation, metric, value });
  };

  return {
    metrics,
    record,
    getMetricsByPlantation,
    getMetricsByPeriod,
    calculateAverageMetric,
    address,
  };
}

import type { Address } from 'viem';
import {
  createProductionMetric,
  getMetricsByPlantation,
  getMetricsByPeriod,
  calculateAverageMetric,
  type ProductionMetric,
} from '@/lib/onchain-farm-production-analytics-utils';

export function useOnchainFarmProductionAnalytics() {
  const { address } = useAccount();
  const [metrics, setMetrics] = useState<ProductionMetric[]>([]);

  const record = (
    plantation: Address,
    metric: string,
    value: bigint,
    period: string
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const productionMetric = createProductionMetric(
      address,
      plantation,
      metric,
      value,
      period
    );
    setMetrics((prev) => [...prev, productionMetric]);
    console.log('Recording production metric:', { plantation, metric, value });
  };

  return {
    metrics,
    record,
    getMetricsByPlantation,
    getMetricsByPeriod,
    calculateAverageMetric,
    address,
  };
}
