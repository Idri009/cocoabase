import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  generateMerkleProof,
  verifyMerkleProof,
  createMerkleTree,
  type MerkleProof,
} from '@/lib/onchain-merkle-utils';

export function useOnchainMerkle() {
  const { address } = useAccount();
  const [proofs, setProofs] = useState<MerkleProof[]>([]);
  const [treeRoot, setTreeRoot] = useState<string | null>(null);

  const generateProof = (
    leaf: string,
    leaves: string[],
    root: string
  ): MerkleProof | null => {
    try {
      const proof = generateMerkleProof(leaf, leaves, root);
      setProofs((prev) => [...prev, proof]);
      console.log('Generating merkle proof:', proof);
      return proof;
    } catch (error) {
      console.error('Error generating proof:', error);
      return null;
    }
  };

  const verifyProof = (proof: MerkleProof): boolean => {
    const isValid = verifyMerkleProof(proof);
    console.log('Verifying merkle proof:', { proof, isValid });
    return isValid;
  };

  const buildTree = (addresses: Address[]): string => {
    const root = createMerkleTree(addresses);
    setTreeRoot(root);
    console.log('Building merkle tree:', { addresses, root });
    return root;
  };

  return {
    proofs,
    treeRoot,
    generateProof,
    verifyProof,
    buildTree,
    address,
  };
}

