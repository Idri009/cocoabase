import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createTask,
  type Task,
} from '@/lib/onchain-task-management-system-utils';

export function useOnchainTaskManagementSystem() {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<Task[]>([]);

  const create = async (
    plantationId: bigint,
    taskName: string,
    dueDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const task = createTask(address, plantationId, taskName, dueDate);
    setTasks([...tasks, task]);
  };

  return { tasks, create, address };
}
