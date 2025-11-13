import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFinancialReport,
  type FinancialReport,
} from '@/lib/onchain-farm-financial-reporting-utils';

/**
 * Hook for onchain farm financial reporting
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmFinancialReporting() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [reports, setReports] = useState<FinancialReport[]>([]);

  const generateReport = async (
    plantationId: string,
    period: string,
    revenue: bigint,
    expenses: bigint,
    profit: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const report = createFinancialReport(address, plantationId, period, revenue, expenses, profit);
    setReports([...reports, report]);
  };

  const verifyReport = async (
    contractAddress: Address,
    reportId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyReport',
      args: [reportId],
    });
  };

  return { reports, generateReport, verifyReport, address };
}

