import { type Address } from 'viem';

/**
 * Onchain farm crop research utilities
 * Crop research data sharing
 */

export interface ResearchProject {
  id: string;
  projectId: bigint;
  researcher: Address;
  title: string;
  description: string;
  startDate: bigint;
  endDate: bigint;
  isActive: boolean;
  budget: bigint;
  category: string;
}

export interface ResearchData {
  id: string;
  dataId: bigint;
  projectId: bigint;
  contributor: Address;
  dataType: string;
  dataValue: string;
  timestamp: bigint;
  isPublic: boolean;
}

export function createResearchProject(
  address: Address,
  title: string,
  description: string,
  endDate: bigint,
  budget: bigint,
  category: string
): ResearchProject {
  return {
    id: `${Date.now()}-${Math.random()}`,
    projectId: BigInt(0),
    researcher: address,
    title,
    description,
    startDate: BigInt(Date.now()),
    endDate,
    isActive: true,
    budget,
    category,
  };
}

export function createResearchData(
  address: Address,
  projectId: bigint,
  dataType: string,
  dataValue: string,
  isPublic: boolean
): ResearchData {
  return {
    id: `${Date.now()}-${Math.random()}`,
    dataId: BigInt(0),
    projectId,
    contributor: address,
    dataType,
    dataValue,
    timestamp: BigInt(Date.now()),
    isPublic,
  };
}

