import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createZKStatement,
  generateZKProof,
  verifyZKProof,
  createMerkleZKProof,
  createRangeZKProof,
  validateZKProofStructure,
  type ZKProof,
  type ZKStatement,
} from '@/lib/onchain-zk-proof-utils';

export function useOnchainZKProof() {
  const { address } = useAccount();
  const [proofs, setProofs] = useState<ZKProof[]>([]);
  const [statements, setStatements] = useState<ZKStatement[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const createStatement = (
    statement: string,
    publicInputs: string[],
    privateInputs: string[],
    circuit: string
  ): ZKStatement => {
    const zkStatement = createZKStatement(
      statement,
      publicInputs,
      privateInputs,
      circuit
    );
    setStatements((prev) => [...prev, zkStatement]);
    console.log('Creating ZK statement:', zkStatement);
    return zkStatement;
  };

  const generateProof = async (
    statement: ZKStatement,
    proof: string,
    verificationKey: string
  ): Promise<ZKProof> => {
    setIsGenerating(true);
    try {
      const zkProof = generateZKProof(statement, proof, verificationKey);
      setProofs((prev) => [...prev, zkProof]);
      console.log('Generating ZK proof:', zkProof);
      return zkProof;
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyProof = async (zkProof: ZKProof): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const isValid = verifyZKProof(zkProof);
      console.log('Verifying ZK proof:', { zkProof, isValid });
      return isValid;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    proofs,
    statements,
    createStatement,
    generateProof,
    verifyProof,
    createMerkleZKProof,
    createRangeZKProof,
    validateZKProofStructure,
    isGenerating,
    isVerifying,
    address,
  };
}

