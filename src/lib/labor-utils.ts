export type WorkerRole = "farmer" | "supervisor" | "harvester" | "maintenance" | "admin";

export type WorkStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  hourlyRate: number;
  skills: string[];
  availability: {
    start: string;
    end: string;
    days: number[];
  };
  contact?: string;
}

export interface LaborRecord {
  id: string;
  plantationId: string;
  workerId: string;
  taskId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  hours: number;
  status: WorkStatus;
  hourlyRate: number;
  totalCost: number;
  notes?: string;
}

export const calculateLaborCost = (
  hours: number,
  hourlyRate: number
): number => {
  return hours * hourlyRate;
};

export const calculateTotalLaborCost = (
  records: LaborRecord[],
  startDate?: Date,
  endDate?: Date
): number => {
  const filtered = records.filter((r) => {
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;
    return true;
  });

  return filtered.reduce((sum, record) => sum + record.totalCost, 0);
};

export const getLaborCostByRole = (
  records: LaborRecord[],
  workers: Worker[]
): Record<WorkerRole, number> => {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const costs: Record<WorkerRole, number> = {
    farmer: 0,
    supervisor: 0,
    harvester: 0,
    maintenance: 0,
    admin: 0,
  };

  records.forEach((record) => {
    const worker = workerMap.get(record.workerId);
    if (worker) {
      costs[worker.role] += record.totalCost;
    }
  });

  return costs;
};

export const getLaborHoursByRole = (
  records: LaborRecord[],
  workers: Worker[]
): Record<WorkerRole, number> => {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const hours: Record<WorkerRole, number> = {
    farmer: 0,
    supervisor: 0,
    harvester: 0,
    maintenance: 0,
    admin: 0,
  };

  records.forEach((record) => {
    const worker = workerMap.get(record.workerId);
    if (worker) {
      hours[worker.role] += record.hours;
    }
  });

  return hours;
};

export const calculateAverageHourlyRate = (
  records: LaborRecord[]
): number => {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.hourlyRate, 0);
  return sum / records.length;
};

export const getWorkerUtilization = (
  workerId: string,
  records: LaborRecord[],
  periodDays: number = 30
): number => {
  const workerRecords = records.filter((r) => r.workerId === workerId);
  const totalHours = workerRecords.reduce((sum, r) => sum + r.hours, 0);
  const maxHours = periodDays * 8;
  return maxHours > 0 ? (totalHours / maxHours) * 100 : 0;
};

export const findAvailableWorkers = (
  workers: Worker[],
  date: Date,
  requiredRole?: WorkerRole
): Worker[] => {
  const dayOfWeek = date.getDay();
  return workers.filter((worker) => {
    if (requiredRole && worker.role !== requiredRole) return false;
    return worker.availability.days.includes(dayOfWeek);
  });
};

export const calculateLaborEfficiency = (
  plannedHours: number,
  actualHours: number
): number => {
  if (plannedHours === 0) return 0;
  return (plannedHours / actualHours) * 100;
};

export const getLaborSummary = (
  records: LaborRecord[],
  workers: Worker[]
): {
  totalCost: number;
  totalHours: number;
  averageHourlyRate: number;
  costByRole: Record<WorkerRole, number>;
  hoursByRole: Record<WorkerRole, number>;
} => {
  return {
    totalCost: calculateTotalLaborCost(records),
    totalHours: records.reduce((sum, r) => sum + r.hours, 0),
    averageHourlyRate: calculateAverageHourlyRate(records),
    costByRole: getLaborCostByRole(records, workers),
    hoursByRole: getLaborHoursByRole(records, workers),
  };
};

