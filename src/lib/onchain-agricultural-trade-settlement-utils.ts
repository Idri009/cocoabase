import { type Address } from 'viem';

export interface TradeSettlement {
  id: bigint;
  buyer: Address;
  seller: Address;
  tradeId: bigint;
  settlementAmount: bigint;
  settlementDate: bigint;
  status: 'pending' | 'settled' | 'disputed';
  txHash: string;
}

export function createSettlement(
  buyer: Address,
  seller: Address,
  tradeId: bigint,
  settlementAmount: bigint
): TradeSettlement {
  return {
    id: BigInt(Date.now()),
    buyer,
    seller,
    tradeId,
    settlementAmount,
    settlementDate: BigInt(Date.now()),
    status: 'pending',
    txHash: '',
  };
}

export function settleTrade(
  settlement: TradeSettlement
): TradeSettlement {
  return {
    ...settlement,
    status: 'settled',
  };
}

export function getPendingSettlements(
  settlements: TradeSettlement[]
): TradeSettlement[] {
  return settlements.filter((s) => s.status === 'pending');
}

export function getSettlementsByParty(
  settlements: TradeSettlement[],
  party: Address
): TradeSettlement[] {
  return settlements.filter(
    (s) =>
      s.buyer.toLowerCase() === party.toLowerCase() ||
      s.seller.toLowerCase() === party.toLowerCase()
  );
}
