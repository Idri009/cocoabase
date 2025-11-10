import { type Address } from 'viem';

export interface WorkerAttendance {
  id: bigint;
  owner: Address;
  workerAddress: Address;
  checkInTime: bigint;
  checkOutTime: bigint;
  workDate: bigint;
  hoursWorked: number;
  txHash: string;
}

export function recordCheckIn(
  owner: Address,
  workerAddress: Address,
  workDate: bigint
): WorkerAttendance {
  return {
    id: BigInt(Date.now()),
    owner,
    workerAddress,
    checkInTime: BigInt(Date.now()),
    checkOutTime: BigInt(0),
    workDate,
    hoursWorked: 0,
    txHash: '',
  };
}

export function recordCheckOut(
  attendance: WorkerAttendance
): WorkerAttendance {
  const checkOutTime = BigInt(Date.now());
  const hoursWorked = Number((checkOutTime - attendance.checkInTime) / BigInt(3600000));
  return {
    ...attendance,
    checkOutTime,
    hoursWorked,
  };
}

export function getWorkerAttendance(
  records: WorkerAttendance[],
  workerAddress: Address
): WorkerAttendance[] {
  return records.filter((r) => r.workerAddress.toLowerCase() === workerAddress.toLowerCase());
}

export function calculateTotalHours(
  records: WorkerAttendance[]
): number {
  return records.reduce((total, r) => total + r.hoursWorked, 0);
}
