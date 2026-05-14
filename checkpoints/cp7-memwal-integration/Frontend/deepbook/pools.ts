import { deepbookIndexer } from './indexer';
import type { Pool, Ticker } from './types';

export const TESTNET_POOLS = [
  'DEEP_SUI',
  'SUI_DBUSDC',
  'WAL_DBUSDC',
  'DEEP_DBUSDC',
];

export interface PoolInfo {
  name: string;
  baseSymbol: string;
  quoteSymbol: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
  isActive: boolean;
}

let poolsCache: Pool[] | null = null;
let poolsCacheTime = 0;
const POOLS_CACHE_TTL = 60_000;

export async function getPools(): Promise<Pool[]> {
  if (poolsCache && Date.now() - poolsCacheTime < POOLS_CACHE_TTL) {
    return poolsCache;
  }

  try {
    const pools = await deepbookIndexer.getPools();
    poolsCache = pools;
    poolsCacheTime = Date.now();
    return pools;
  } catch (error) {
    console.error('[Pools] Failed to fetch pools:', error);
    return [];
  }
}

export async function getPoolByName(poolName: string): Promise<Pool | null> {
  const pools = await getPools();
  return pools.find(p => p.pool_name === poolName) || null;
}

export async function getPoolPrice(poolName: string): Promise<number | null> {
  try {
    const ticker = await deepbookIndexer.getTicker();
    return ticker[poolName]?.last_price || null;
  } catch (error) {
    console.error('[Pools] Failed to get price:', error);
    return null;
  }
}

export async function getAllPoolPrices(): Promise<Record<string, number>> {
  try {
    const ticker = await deepbookIndexer.getTicker();
    const prices: Record<string, number> = {};

    for (const poolName of TESTNET_POOLS) {
      if (ticker[poolName]) {
        prices[poolName] = ticker[poolName].last_price;
      }
    }

    return prices;
  } catch (error) {
    console.error('[Pools] Failed to get all prices:', error);
    return {};
  }
}

export async function getPoolInfo(poolName: string): Promise<PoolInfo | null> {
  try {
    const [pools, ticker] = await Promise.all([
      getPools(),
      deepbookIndexer.getTicker(),
    ]);

    const pool = pools.find(p => p.pool_name === poolName);
    const tickerData = ticker[poolName];

    if (!pool) return null;

    return {
      name: pool.pool_name,
      baseSymbol: pool.base_asset_symbol,
      quoteSymbol: pool.quote_asset_symbol,
      lastPrice: tickerData?.last_price || 0,
      change24h: 0,
      volume24h: tickerData?.base_volume || 0,
      isActive: tickerData?.isFrozen === 0,
    };
  } catch (error) {
    console.error('[Pools] Failed to get pool info:', error);
    return null;
  }
}

export async function getActivePools(): Promise<string[]> {
  try {
    const ticker = await deepbookIndexer.getTicker();
    return Object.entries(ticker)
      .filter(([_, data]) => data.isFrozen === 0 && data.last_price > 0)
      .map(([name]) => name);
  } catch (error) {
    console.error('[Pools] Failed to get active pools:', error);
    return TESTNET_POOLS;
  }
}

export function getPoolDisplayName(poolName: string): string {
  return poolName.replace('_', ' / ');
}

export function formatPoolPair(poolName: string): { base: string; quote: string } {
  const parts = poolName.split('_');
  return {
    base: parts[0] || '',
    quote: parts[1] || '',
  };
}

export default {
  TESTNET_POOLS,
  getPools,
  getPoolByName,
  getPoolPrice,
  getAllPoolPrices,
  getPoolInfo,
  getActivePools,
  getPoolDisplayName,
  formatPoolPair,
};