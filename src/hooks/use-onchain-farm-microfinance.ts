import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLoan as createLoanData,
  type Loan,
} from '@/lib/onchain-farm-microfinance-utils';

/**
 * Hook for onchain farm microfinance
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmMicrofinance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [loans, setLoans] = useState<Loan[]>([]);

  const createLoan = async (
    contractAddress: Address,
    borrower: Address,
    principal: bigint,
    termDays: bigint,
    purpose: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const loanData = createLoanData(address, principal, BigInt(0), termDays, purpose);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'borrower', type: 'address' },
            { name: 'principal', type: 'uint256' },
            { name: 'termDays', type: 'uint256' },
            { name: 'purpose', type: 'string' }
          ],
          name: 'createLoan',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createLoan',
      args: [borrower, principal, termDays, purpose],
    });
    
    setLoans([...loans, loanData]);
  };

  const repayLoan = async (
    contractAddress: Address,
    loanId: bigint,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'loanId', type: 'uint256' }],
          name: 'repayLoan',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'repayLoan',
      args: [loanId],
      value: value,
    });
  };

  const makePayment = async (
    contractAddress: Address,
    loanId: bigint,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'loanId', type: 'uint256' }],
          name: 'makePayment',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'makePayment',
      args: [loanId],
      value: value,
    });
  };

  const checkDefault = async (
    contractAddress: Address,
    loanId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'loanId', type: 'uint256' }],
          name: 'checkDefault',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'checkDefault',
      args: [loanId],
    });
  };

  return { 
    loans, 
    createLoan, 
    repayLoan,
    makePayment,
    checkDefault,
    address 
  };
}

