export type SoilType = "clay" | "loam" | "sandy" | "silt" | "peat";

export type NutrientLevel = "deficient" | "low" | "adequate" | "high" | "excessive";

export interface SoilTest {
  id: string;
  plantationId: string;
  testDate: Date;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  soilType: SoilType;
  notes?: string;
}

export interface NutrientRecommendation {
  nutrient: "nitrogen" | "phosphorus" | "potassium";
  currentLevel: number;
  recommendedLevel: number;
  deficiency: number;
  recommendation: string;
}

export const assessNutrientLevel = (
  nutrient: "nitrogen" | "phosphorus" | "potassium",
  value: number
): NutrientLevel => {
  const ranges: Record<string, { min: number; max: number }> = {
    nitrogen: { min: 20, max: 40 },
    phosphorus: { min: 15, max: 30 },
    potassium: { min: 150, max: 250 },
  };

  const range = ranges[nutrient];
  if (value < range.min * 0.5) return "deficient";
  if (value < range.min) return "low";
  if (value <= range.max) return "adequate";
  if (value <= range.max * 1.5) return "high";
  return "excessive";
};

export const assessPHLevel = (ph: number): {
  level: "acidic" | "neutral" | "alkaline";
  suitable: boolean;
} => {
  const optimalRange = { min: 6.0, max: 7.0 };
  let level: "acidic" | "neutral" | "alkaline";
  let suitable = false;

  if (ph < 6.0) {
    level = "acidic";
  } else if (ph > 7.0) {
    level = "alkaline";
  } else {
    level = "neutral";
    suitable = true;
  }

  return { level, suitable };
};

export const generateNutrientRecommendations = (
  test: SoilTest
): NutrientRecommendation[] => {
  const recommendations: NutrientRecommendation[] = [];

  const nutrients: Array<"nitrogen" | "phosphorus" | "potassium"> = [
    "nitrogen",
    "phosphorus",
    "potassium",
  ];

  nutrients.forEach((nutrient) => {
    const value = test[nutrient];
    const level = assessNutrientLevel(nutrient, value);
    const optimalRanges: Record<string, { min: number; max: number }> = {
      nitrogen: { min: 20, max: 40 },
      phosphorus: { min: 15, max: 30 },
      potassium: { min: 150, max: 250 },
    };

    const optimal = optimalRanges[nutrient];
    let recommendation = "";
    let deficiency = 0;

    if (level === "deficient" || level === "low") {
      deficiency = optimal.min - value;
      recommendation = `Apply ${nutrient} fertilizer. Target: ${optimal.min}-${optimal.max} ppm`;
    } else if (level === "adequate") {
      recommendation = `Maintain current ${nutrient} levels`;
    } else if (level === "high" || level === "excessive") {
      recommendation = `Reduce ${nutrient} application. Current levels are above optimal`;
    }

    recommendations.push({
      nutrient,
      currentLevel: value,
      recommendedLevel: (optimal.min + optimal.max) / 2,
      deficiency: Math.max(0, deficiency),
      recommendation,
    });
  });

  return recommendations;
};

export const calculateSoilHealthScore = (test: SoilTest): number => {
  let score = 100;

  const phAssessment = assessPHLevel(test.ph);
  if (!phAssessment.suitable) {
    score -= 20;
  }

  const nutrients = ["nitrogen", "phosphorus", "potassium"] as const;
  nutrients.forEach((nutrient) => {
    const level = assessNutrientLevel(nutrient, test[nutrient]);
    if (level === "deficient" || level === "excessive") {
      score -= 15;
    } else if (level === "low" || level === "high") {
      score -= 5;
    }
  });

  if (test.organicMatter < 3) {
    score -= 10;
  } else if (test.organicMatter > 5) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
};

export const getSoilTypeCharacteristics = (soilType: SoilType): {
  drainage: string;
  fertility: string;
  workability: string;
} => {
  const characteristics: Record<
    SoilType,
    { drainage: string; fertility: string; workability: string }
  > = {
    clay: {
      drainage: "Poor",
      fertility: "High",
      workability: "Difficult when wet",
    },
    loam: {
      drainage: "Good",
      fertility: "High",
      workability: "Excellent",
    },
    sandy: {
      drainage: "Excellent",
      fertility: "Low",
      workability: "Easy",
    },
    silt: {
      drainage: "Moderate",
      fertility: "Moderate",
      workability: "Good",
    },
    peat: {
      drainage: "Poor",
      fertility: "Very High",
      workability: "Easy",
    },
  };

  return characteristics[soilType];
};

export const compareSoilTests = (
  test1: SoilTest,
  test2: SoilTest
): {
  phChange: number;
  nutrientChanges: Record<string, number>;
  healthScoreChange: number;
} => {
  const phChange = test2.ph - test1.ph;
  const nutrientChanges = {
    nitrogen: test2.nitrogen - test1.nitrogen,
    phosphorus: test2.phosphorus - test1.phosphorus,
    potassium: test2.potassium - test1.potassium,
  };
  const healthScore1 = calculateSoilHealthScore(test1);
  const healthScore2 = calculateSoilHealthScore(test2);

  return {
    phChange,
    nutrientChanges,
    healthScoreChange: healthScore2 - healthScore1,
  };
};

