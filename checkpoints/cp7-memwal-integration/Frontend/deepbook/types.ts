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
  price: number;
  base_volume: number;
  quote_volume: number;
  timestamp: number;
  type: 'buy' | 'sell';
  taker_is_bid: boolean;
}

export const DEEPBOOK_TESTNET_INDEXER = 'https://deepbook-indexer.testnet.mystenlabs.com';

export const ASSET_SCALARS: Record<string, number> = {
  SUI: 9,
  USDC: 6,
  WUSDC: 6,
  WUSDT: 6,
  DEEP: 6,
  NS: 6,
  WAL: 9,
};

export function formatPrice(price: number, decimals: number = 4): string {
  return price.toFixed(decimals);
}

export function formatVolume(volume: number, decimals: number = 2): string {
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(decimals)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(decimals)}K`;
  return volume.toFixed(decimals);
}

export function getLevelPrice(level: OrderBook['bids'][0]): string {
  return Array.isArray(level) ? level[0] : level.price;
}

export function getLevelQuantity(level: OrderBook['bids'][0]): string {
  return Array.isArray(level) ? level[1] : level.quantity;
}