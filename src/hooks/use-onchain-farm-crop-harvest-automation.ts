import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createAutomationRule,
  type AutomationRule,
} from '@/lib/onchain-farm-crop-harvest-automation-utils';

/**
 * Hook for onchain crop harvest automation
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestAutomation() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);

  const createRule = async (
    contractAddress: Address,
    plantationId: bigint,
    cropType: string,
    maturityThreshold: bigint,
    harvestWindow: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const rule = createAutomationRule(
      address,
      plantationId,
      cropType,
      maturityThreshold,
      harvestWindow
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'cropType', type: 'string' },
            { name: 'maturityThreshold', type: 'uint256' },
            { name: 'harvestWindow', type: 'uint256' }
          ],
          name: 'createAutomationRule',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createAutomationRule',
      args: [plantationId, cropType, maturityThreshold, harvestWindow],
    });
    
    setAutomationRules([...automationRules, rule]);
  };

  const executeHarvest = async (
    contractAddress: Address,
    ruleId: bigint,
    yieldAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'ruleId', type: 'uint256' },
            { name: 'yieldAmount', type: 'uint256' }
          ],
          name: 'executeHarvest',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'executeHarvest',
      args: [ruleId, yieldAmount],
    });
  };

  return { 
    automationRules, 
    createRule, 
    executeHarvest, 
    address 
  };
}



