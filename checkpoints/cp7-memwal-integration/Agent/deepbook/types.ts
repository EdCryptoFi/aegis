export interface Pool {
  pool_id: string;
  pool_name: string;
  base_asset_id: string;
  base_asset_decimals: number;
  base_asset_symbol: string;
  base_asset_name: string;
  quote_asset_id: string;
  quote_asset_decimals: number;
  quote_asset_symbol: string;
  quote_asset_name: string;
  min_size: number;
  lot_size: number;
  tick_size: number;
}

export interface Ticker {
  base_volume: number;
  quote_volume: number;
  last_price: number;
  isFrozen: 0 | 1;
}

export interface OrderBookLevel {
  price: string;
  quantity: string;
}

export interface OrderBook {
  timestamp: string;
  bids: (OrderBookLevel | [string, string])[];
  asks: (OrderBookLevel | [string, string])[];
}

export interface Trade {
  event_digest: string;
  digest: string;
  trade_id: string;
  maker_order_id: string;
  taker_order_id: string;
  maker_balance_manager_id: string;
  taker_balance_manager_id: string;
  price: number;
  base_volume: number;
  quote_volume: number;
  timestamp: number;
  type: 'buy' | 'sell';
  taker_is_bid: boolean;
  taker_fee: number;
  maker_fee: number;
  taker_fee_is_deep: boolean;
  maker_fee_is_deep: boolean;
}

export interface OrderUpdate {
  order_id: string;
  balance_manager_id: string;
  timestamp: number;
  original_quantity: number;
  remaining_quantity: number;
  filled_quantity: number;
  price: number;
  status: 'Placed' | 'Canceled' | 'Filled';
  type: 'buy' | 'sell';
}

export interface PointsInfo {
  address: string;
  total_points: number;
}

export interface PoolVolume {
  base: number;
  quote: number;
}

export const DEEPBOOK_TESTNET_INDEXER = 'https://deepbook-indexer.testnet.mystenlabs.com';
export const DEEPBOOK_MAINNET_INDEXER = 'https://deepbook-indexer.mainnet.mystenlabs.com';

export const ASSET_SCALARS: Record<string, number> = {
  SUI: 9,
  USDC: 6,
  WUSDC: 6,
  WUSDT: 6,
  DEEP: 6,
  NS: 6,
  WAL: 9,
  AETH: 8,
  AUSD: 6,
};

export function convertFromBaseUnit(value: number, assetSymbol: string): number {
  const scalar = ASSET_SCALARS[assetSymbol] || 9;
  return value / Math.pow(10, scalar);
}

export function convertToBaseUnit(value: number, assetSymbol: string): number {
  const scalar = ASSET_SCALARS[assetSymbol] || 9;
  return Math.floor(value * Math.pow(10, scalar));
}