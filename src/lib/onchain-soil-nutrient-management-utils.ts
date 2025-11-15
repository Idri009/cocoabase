import { type Address } from 'viem';

/**
 * Onchain Soil Nutrient Management utilities
 * Manage soil nutrients onchain with Reown wallet integration
 */

export interface SoilNutrientRecord {
  id: bigint;
  farmer: Address;
  fieldId: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  organicMatter: number;
  timestamp: bigint;
  recommendations: string[];
}

export function createSoilNutrientRecord(
  farmer: Address,
  fieldId: string,
  nitrogen: number,
  phosphorus: number,
  potassium: number,
  pH: number,
  organicMatter: number
): SoilNutrientRecord {
  const now = BigInt(Date.now());
  const recommendations = generateNutrientRecommendations(
    nitrogen,
    phosphorus,
    potassium,
    pH
  );
  return {
    id: BigInt(0),
    farmer,
    fieldId,
    nitrogen,
    phosphorus,
    potassium,
    pH,
    organicMatter,
    timestamp: now,
    recommendations,
  };
}

export function generateNutrientRecommendations(
  nitrogen: number,
  phosphorus: number,
  potassium: number,
  pH: number
): string[] {
  const recommendations: string[] = [];
  if (nitrogen < 20) recommendations.push('Apply nitrogen fertilizer');
  if (phosphorus < 15) recommendations.push('Add phosphorus supplement');
  if (potassium < 200) recommendations.push('Increase potassium levels');
  if (pH < 6.0) recommendations.push('Apply lime to raise pH');
  if (pH > 7.5) recommendations.push('Apply sulfur to lower pH');
  return recommendations;
}

export function calculateNutrientBalance(record: SoilNutrientRecord): number {
  const idealNitrogen = 30;
  const idealPhosphorus = 20;
  const idealPotassium = 250;
  
  const nScore = Math.min((record.nitrogen / idealNitrogen) * 100, 100);
  const pScore = Math.min((record.phosphorus / idealPhosphorus) * 100, 100);
  const kScore = Math.min((record.potassium / idealPotassium) * 100, 100);
  
  return (nScore + pScore + kScore) / 3;
}



