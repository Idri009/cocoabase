export type InventoryItem = {
  id: string;
  name: string;
  category: "equipment" | "supplies" | "seeds" | "fertilizer" | "tools" | "other";
  quantity: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  costPerUnit: number;
  supplier?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  location?: string;
  notes?: string;
};

export type InventoryTransaction = {
  id: string;
  itemId: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  timestamp: Date;
  performedBy?: string;
};

export const isLowStock = (item: InventoryItem): boolean => {
  return item.quantity <= item.minThreshold;
};

export const isOverstocked = (item: InventoryItem): boolean => {
  return item.maxThreshold > 0 && item.quantity >= item.maxThreshold;
};

export const needsRestocking = (item: InventoryItem): boolean => {
  return isLowStock(item);
};

export const calculateInventoryValue = (items: InventoryItem[]): number => {
  return items.reduce(
    (total, item) => total + item.quantity * item.costPerUnit,
    0
  );
};

export const getLowStockItems = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter(isLowStock);
};

export const getExpiringSoon = (
  items: InventoryItem[],
  daysAhead: number = 30
): InventoryItem[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return items.filter((item) => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate) <= cutoffDate;
  });
};

export const calculateReorderQuantity = (item: InventoryItem): number => {
  const idealStock = item.maxThreshold || item.minThreshold * 3;
  return Math.max(0, idealStock - item.quantity);
};

export const getInventoryByCategory = (
  items: InventoryItem[]
): Record<string, InventoryItem[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);
};

export const recordTransaction = (
  item: InventoryItem,
  type: "in" | "out" | "adjustment",
  quantity: number,
  reason: string,
  performedBy?: string
): { updatedItem: InventoryItem; transaction: InventoryTransaction } => {
  const transaction: InventoryTransaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    itemId: item.id,
    type,
    quantity,
    reason,
    timestamp: new Date(),
    performedBy,
  };

  let newQuantity = item.quantity;
  if (type === "in") {
    newQuantity += quantity;
  } else if (type === "out") {
    newQuantity = Math.max(0, newQuantity - quantity);
  } else {
    newQuantity = quantity;
  }

  const updatedItem: InventoryItem = {
    ...item,
    quantity: newQuantity,
    lastRestocked: type === "in" ? new Date() : item.lastRestocked,
  };

  return { updatedItem, transaction };
};

export const getInventoryHealth = (items: InventoryItem[]): {
  score: number;
  issues: string[];
} => {
  const lowStockCount = getLowStockItems(items).length;
  const expiringCount = getExpiringSoon(items).length;
  const totalItems = items.length;

  let score = 100;
  const issues: string[] = [];

  if (lowStockCount > 0) {
    const percentage = (lowStockCount / totalItems) * 100;
    score -= percentage * 0.5;
    issues.push(`${lowStockCount} item(s) are low on stock`);
  }

  if (expiringCount > 0) {
    const percentage = (expiringCount / totalItems) * 100;
    score -= percentage * 0.3;
    issues.push(`${expiringCount} item(s) are expiring soon`);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
  };
};

export const generateRestockReport = (
  items: InventoryItem[]
): Array<{ item: InventoryItem; reorderQuantity: number; urgency: "high" | "medium" | "low" }> => {
  const lowStockItems = getLowStockItems(items);

  return lowStockItems.map((item) => {
    const reorderQuantity = calculateReorderQuantity(item);
    const stockPercentage = (item.quantity / item.minThreshold) * 100;
    
    let urgency: "high" | "medium" | "low" = "low";
    if (stockPercentage < 25) {
      urgency = "high";
    } else if (stockPercentage < 50) {
      urgency = "medium";
    }

    return {
      item,
      reorderQuantity,
      urgency,
    };
  });
};

