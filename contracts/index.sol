// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Onchain Farm Features Contracts
 * @notice Central documentation for all onchain farm feature contracts
 * @dev All contracts support Reown wallet integration via standard ERC interfaces
 * 
 * Contracts:
 * - FarmEquipmentMaintenance: Equipment maintenance scheduling and tracking
 * - FarmWaterRights: Water rights management and allocation
 * - FarmLaborContracts: Labor contract management
 * - FarmInsurancePolicy: Insurance policy management
 * - FarmSubsidyClaims: Subsidy claims processing
 * - FarmCertificationRenewal: Certification renewal management
 * - FarmComplianceReporting: Compliance reporting system
 * - FarmFinancialPlanning: Financial planning and budgeting
 * - FarmBudgetPlanning: Budget planning and tracking
 * - FarmInvestmentTracking: Investment tracking
 * - FarmAssetTokenization: Asset tokenization as NFTs
 * - FarmLandValuation: Land valuation system
 * - FarmPerformanceBenchmarking: Performance benchmarking
 * - FarmProfitabilityAnalysis: Profitability analysis
 * - FarmProductionAnalytics: Production analytics
 * - FarmResourceOptimization: Resource optimization
 * - FarmRiskAssessment: Risk assessment system
 * - FarmSustainabilityScoring: Sustainability scoring
 * - FarmSuccessionPlanning: Succession planning
 * - FarmWasteManagement: Waste management
 * 
 * 20 New Contracts (All use Reown wallet):
 * - FarmCropYieldPrediction: Crop yield prediction with confidence scores
 * - FarmWeatherInsurance: Weather-based insurance policies
 * - FarmSoilCarbonSequestration: Carbon sequestration tracking and credits
 * - FarmWaterRightsTrading: Water rights trading marketplace
 * - FarmBiodiversityCredits: Biodiversity credit issuance and trading
 * - FarmRenewableEnergyTrading: Renewable energy trading marketplace
 * - FarmDataMonetization: Farm data monetization marketplace
 * - FarmCarbonOffsetMarketplace: Carbon offset trading marketplace
 * - FarmInsurancePool: Collective insurance pool system
 * - FarmCooperativeVoting: Onchain voting for cooperatives
 * - FarmAssetLeasing: Asset leasing with onchain payments
 * - FarmLaborPaymentEscrow: Labor payment escrow system
 * - FarmSupplyChainPayments: Supply chain payment processing
 * - FarmQualityAssurance: Quality checks and certifications
 * - FarmLandRegistry: Onchain land parcel registry
 * - FarmExportCertification: Export certificate management
 * - FarmEquipmentSharing: Equipment sharing with deposits
 * - FarmHarvestFutures: Harvest futures contracts
 * - FarmSeedExchange: Seed trading marketplace
 * - FarmSustainabilityRewards: Sustainability reward system
 * 
 * 20 Additional Contracts (All use Reown wallet):
 * - FarmCropRotationOptimization: Crop rotation planning and optimization
 * - FarmPestManagement: Pest detection and treatment tracking
 * - FarmIrrigationManagement: Irrigation scheduling and water usage
 * - FarmSoilTesting: Soil test recording and verification
 * - FarmHarvestScheduling: Harvest scheduling and yield tracking
 * - FarmLivestockHealth: Livestock health records and vaccinations
 * - FarmFertilizerApplication: Fertilizer application tracking
 * - FarmWeatherMonitoring: Weather data recording
 * - FarmCropDiseaseTracking: Crop disease detection and treatment
 * - FarmInventoryManagement: Farm inventory management
 * - FarmFieldMapping: Field mapping with GPS coordinates
 * - FarmCropMonitoring: Crop growth and health monitoring
 * - FarmLaborScheduling: Labor task scheduling
 * - FarmEquipmentTracking: Equipment usage tracking
 * - FarmCropStorage: Crop storage management
 * - FarmSupplyChainTracking: Supply chain location tracking
 * - FarmOrganicCertification: Organic certification management
 * - FarmMarketPriceTracking: Market price recording
 * - FarmCompostManagement: Compost batch management
 * - FarmSeedManagement: Seed batch and quality management
 * 
 * 20 More Additional Contracts (All use Reown wallet):
 * - FarmCropHarvestQuality: Harvest quality grading system
 * - FarmLivestockBreeding: Livestock breeding record tracking
 * - FarmCropPollination: Crop pollination activity tracking
 * - FarmWaterQuality: Water quality testing system
 * - FarmCropMaturity: Crop maturity stage tracking
 * - FarmLivestockFeeding: Livestock feeding schedule tracking
 * - FarmCropPruning: Crop pruning activity tracking
 * - FarmLivestockMilking: Livestock milking record tracking
 * - FarmCropWeeding: Crop weeding activity tracking
 * - FarmLivestockVaccination: Livestock vaccination tracking
 * - FarmCropTransplanting: Crop transplanting activity tracking
 * - FarmLivestockWeight: Livestock weight measurement tracking
 * - FarmCropThinning: Crop thinning activity tracking
 * - FarmLivestockMovement: Livestock movement tracking
 * - FarmCropGrafting: Crop grafting activity tracking
 * - FarmLivestockSlaughter: Livestock slaughter record tracking
 * - FarmCropSeedling: Crop seedling management
 * - FarmLivestockQuarantine: Livestock quarantine management
 * - FarmCropMulching: Crop mulching activity tracking
 * - FarmLivestockIdentification: Livestock identification tag management
 * 
 * 20 Advanced New Contracts (All use Reown wallet):
 * - FarmCropHarvestAutomation: Automated harvest scheduling and execution
 * - FarmLivestockFeedOptimization: Feed ration optimization for livestock
 * - FarmCropPestResistanceTracking: Crop pest resistance level tracking
 * - FarmSoilMoistureMonitoring: Soil moisture level monitoring
 * - FarmCropYieldOptimization: Crop yield optimization planning
 * - FarmLivestockGeneticsTracking: Livestock genetics and breeding tracking
 * - FarmCropNutritionManagement: Crop nutrition plan management
 * - FarmLivestockReproductionTracking: Livestock reproduction cycle tracking
 * - FarmCropDiseaseResistance: Crop disease resistance tracking
 * - FarmSoilFertilityManagement: Soil fertility assessment and improvement
 * - FarmCropIrrigationScheduling: Crop irrigation schedule management
 * - FarmLivestockWelfareMonitoring: Livestock welfare assessment
 * - FarmCropHarvestForecasting: Harvest date and yield forecasting
 * - FarmSoilErosionPrevention: Soil erosion assessment and prevention
 * - FarmCropPollinationManagement: Crop pollination event management
 * - FarmLivestockFeedQualityControl: Livestock feed quality testing
 * - FarmCropSeedQualityTracking: Crop seed quality tracking
 * - FarmSoilPhManagement: Soil pH level management
 * - FarmCropGrowthStageTracking: Crop growth stage tracking
 * - FarmLivestockBehaviorMonitoring: Livestock behavior observation tracking
 * 
 * 20 Brand New Contracts (All use Reown wallet):
 * - FarmGrainStorage: Grain storage management and tracking
 * - FarmCropInsurancePool: Crop insurance pooling system
 * - FarmLandLeasing: Land leasing agreements
 * - FarmFarmerCooperative: Farmer cooperative management
 * - FarmMicrofinance: Microfinance loans for farmers
 * - FarmCropResearch: Crop research data sharing
 * - FarmWeatherData: Weather data oracle and tracking
 * - FarmDirectMarketplace: Direct farmer-to-buyer marketplace
 * - FarmCropCertification: Crop quality certification
 * - FarmLaborPool: Labor pooling system
 * - FarmEquipmentAuction: Equipment auction system
 * - FarmHarvestScheduling: Harvest scheduling system
 * - FarmSoilHealth: Soil health monitoring and tracking
 * - FarmPestControl: Pest control management
 * - FarmIrrigationEfficiency: Irrigation efficiency tracking
 * - FarmCropVariety: Crop variety management
 * - FarmHarvestQuality: Harvest quality grading
 * - FarmFieldBoundary: Field boundary management
 * - FarmCropRotation: Crop rotation planning
 * - FarmYieldTracking: Yield tracking system
 * - FarmCropFinancing: Crop financing system
 */
