import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createEventLog,
  filterEventsByContract,
  filterEventsByName,
  type EventLog,
} from '@/lib/onchain-event-log-utils';

export function useOnchainEventLog() {
  const { address } = useAccount();
  const [events, setEvents] = useState<EventLog[]>([]);

  const logEvent = (
    contract: Address,
    eventName: string,
    data: string,
    blockNumber: bigint,
    transactionHash: string
  ) => {
    const event = createEventLog(
      contract,
      eventName,
      data,
      blockNumber,
      transactionHash
    );
    setEvents((prev) => [...prev, event]);
    console.log('Logging event:', event);
  };

  return {
    events,
    logEvent,
    filterEventsByContract,
    filterEventsByName,
    address,
  };
}

