import { type Address } from 'viem';
import { keccak256, toBytes, concat } from 'viem';

export interface MerkleProof {
  leaf: string;
  proof: string[];
  root: string;
}

export function hashLeaf(data: string): string {
  return keccak256(toBytes(data));
}

export function hashPair(left: string, right: string): string {
  return keccak256(concat([toBytes(left), toBytes(right)]));
}

export function generateMerkleProof(
  leaf: string,
  leaves: string[],
  root: string
): MerkleProof {
  const proof: string[] = [];
  let currentHash = hashLeaf(leaf);
  let currentIndex = leaves.indexOf(leaf);

  if (currentIndex === -1) {
    throw new Error('Leaf not found in tree');
  }

  let level = leaves.map(hashLeaf);
  let index = currentIndex;

  while (level.length > 1) {
    if (index % 2 === 0) {
      if (index + 1 < level.length) {
        proof.push(level[index + 1]);
        currentHash = hashPair(level[index], level[index + 1]);
      }
    } else {
      proof.push(level[index - 1]);
      currentHash = hashPair(level[index - 1], level[index]);
    }

    index = Math.floor(index / 2);
    const newLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        newLevel.push(hashPair(level[i], level[i + 1]));
      } else {
        newLevel.push(level[i]);
      }
    }
    level = newLevel;
  }

  return {
    leaf,
    proof,
    root: level[0],
  };
}

export function verifyMerkleProof(proof: MerkleProof): boolean {
  let currentHash = hashLeaf(proof.leaf);

  for (const sibling of proof.proof) {
    currentHash = hashPair(currentHash, sibling);
  }

  return currentHash === proof.root;
}

export function createMerkleTree(addresses: Address[]): string {
  const leaves = addresses.map((addr) => hashLeaf(addr));
  let level = leaves;

  while (level.length > 1) {
    const newLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        newLevel.push(hashPair(level[i], level[i + 1]));
      } else {
        newLevel.push(level[i]);
      }
    }
    level = newLevel;
  }

  return level[0];
}
