export type SupplyChainStage = 
  | "harvest"
  | "processing"
  | "storage"
  | "transport"
  | "market"
  | "delivered";

export type SupplyChainStatus = "pending" | "in-progress" | "completed" | "delayed" | "cancelled";

export interface SupplyChainItem {
  id: string;
  plantationId: string;
  harvestId?: string;
  stage: SupplyChainStage;
  status: SupplyChainStatus;
  quantity: number;
  unit: string;
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  location?: string;
  notes?: string;
}

export interface SupplyChainMetrics {
  totalYield: number;
  processedYield: number;
  storedYield: number;
  transportedYield: number;
  marketYield: number;
  deliveredYield: number;
  averageStageTime: number;
  efficiency: number;
}

export const getStageOrder = (): SupplyChainStage[] => {
  return ["harvest", "processing", "storage", "transport", "market", "delivered"];
};

export const getNextStage = (currentStage: SupplyChainStage): SupplyChainStage | null => {
  const stages = getStageOrder();
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
};

export const getPreviousStage = (currentStage: SupplyChainStage): SupplyChainStage | null => {
  const stages = getStageOrder();
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex > 0 ? stages[currentIndex - 1] : null;
};

export const canAdvanceStage = (
  item: SupplyChainItem,
  previousStage?: SupplyChainItem
): boolean => {
  if (item.status !== "completed") return false;
  if (!previousStage) return item.stage === "harvest";
  return previousStage.stage === getPreviousStage(item.stage);
};

export const calculateStageEfficiency = (
  items: SupplyChainItem[],
  stage: SupplyChainStage
): number => {
  const stageItems = items.filter((item) => item.stage === stage);
  if (stageItems.length === 0) return 0;

  const completed = stageItems.filter((item) => item.status === "completed");
  const onTime = completed.filter((item) => {
    if (!item.actualCompletionDate) return false;
    return item.actualCompletionDate <= item.expectedCompletionDate;
  });

  return (onTime.length / completed.length) * 100;
};

export const calculateSupplyChainMetrics = (
  items: SupplyChainItem[]
): SupplyChainMetrics => {
  const stageItems: Record<SupplyChainStage, SupplyChainItem[]> = {
    harvest: [],
    processing: [],
    storage: [],
    transport: [],
    market: [],
    delivered: [],
  };

  items.forEach((item) => {
    stageItems[item.stage].push(item);
  });

  const totalYield = stageItems.harvest.reduce((sum, item) => sum + item.quantity, 0);
  const processedYield = stageItems.processing.reduce((sum, item) => sum + item.quantity, 0);
  const storedYield = stageItems.storage.reduce((sum, item) => sum + item.quantity, 0);
  const transportedYield = stageItems.transport.reduce((sum, item) => sum + item.quantity, 0);
  const marketYield = stageItems.market.reduce((sum, item) => sum + item.quantity, 0);
  const deliveredYield = stageItems.delivered.reduce((sum, item) => sum + item.quantity, 0);

  const completedItems = items.filter((item) => item.actualCompletionDate);
  const averageStageTime = completedItems.length > 0
    ? completedItems.reduce((sum, item) => {
        if (!item.actualCompletionDate) return sum;
        const diff = item.actualCompletionDate.getTime() - item.startDate.getTime();
        return sum + Math.floor(diff / (1000 * 60 * 60 * 24));
      }, 0) / completedItems.length
    : 0;

  const efficiency = totalYield > 0 ? (deliveredYield / totalYield) * 100 : 0;

  return {
    totalYield,
    processedYield,
    storedYield,
    transportedYield,
    marketYield,
    deliveredYield,
    averageStageTime,
    efficiency,
  };
};

export const getItemsByStage = (
  items: SupplyChainItem[]
): Record<SupplyChainStage, SupplyChainItem[]> => {
  return items.reduce(
    (acc, item) => {
      if (!acc[item.stage]) {
        acc[item.stage] = [];
      }
      acc[item.stage].push(item);
      return acc;
    },
    {
      harvest: [],
      processing: [],
      storage: [],
      transport: [],
      market: [],
      delivered: [],
    } as Record<SupplyChainStage, SupplyChainItem[]>
  );
};

export const getDelayedItems = (items: SupplyChainItem[]): SupplyChainItem[] => {
  const now = new Date();
  return items.filter((item) => {
    if (item.status === "completed" || item.status === "cancelled") return false;
    return item.expectedCompletionDate < now;
  });
};

export const calculateStageProgress = (
  items: SupplyChainItem[],
  stage: SupplyChainStage
): number => {
  const stageItems = items.filter((item) => item.stage === stage);
  if (stageItems.length === 0) return 0;

  const completed = stageItems.filter((item) => item.status === "completed").length;
  return (completed / stageItems.length) * 100;
};

export const getSupplyChainSummary = (
  items: SupplyChainItem[]
): {
  totalItems: number;
  byStage: Record<SupplyChainStage, number>;
  byStatus: Record<SupplyChainStatus, number>;
  delayed: number;
  efficiency: number;
} => {
  const byStage = getItemsByStage(items);
  const byStatus = items.reduce(
    (acc, item) => {
      if (!acc[item.status]) {
        acc[item.status] = 0;
      }
      acc[item.status]++;
      return acc;
    },
    {} as Record<SupplyChainStatus, number>
  );

  const metrics = calculateSupplyChainMetrics(items);

  return {
    totalItems: items.length,
    byStage: {
      harvest: byStage.harvest.length,
      processing: byStage.processing.length,
      storage: byStage.storage.length,
      transport: byStage.transport.length,
      market: byStage.market.length,
      delivered: byStage.delivered.length,
    },
    byStatus: {
      pending: byStatus.pending || 0,
      "in-progress": byStatus["in-progress"] || 0,
      completed: byStatus.completed || 0,
      delayed: byStatus.delayed || 0,
      cancelled: byStatus.cancelled || 0,
    },
    delayed: getDelayedItems(items).length,
    efficiency: metrics.efficiency,
  };
};

