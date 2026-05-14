import { deepbookIndexer } from './indexer';
import { Pool, PoolVolume } from './types';

export const TESTNET_POOLS = ['SUI_USDC', 'DEEP_USDC', 'NS_SUI', 'WUSDT_USDC', 'DEEP_SUI', 'NS_USDC'];

export const POOL_CONFIG: Record<string, { base: string; quote: string; decimals: { base: number; quote: number } }> = {
  SUI_USDC: { base: 'SUI', quote: 'USDC', decimals: { base: 9, quote: 6 } },
  DEEP_USDC: { base: 'DEEP', quote: 'USDC', decimals: { base: 6, quote: 6 } },
  NS_SUI: { base: 'NS', quote: 'SUI', decimals: { base: 9, quote: 9 } },
  WUSDT_USDC: { base: 'WUSDT', quote: 'USDC', decimals: { base: 6, quote: 6 } },
  DEEP_SUI: { base: 'DEEP', quote: 'SUI', decimals: { base: 6, quote: 9 } },
  NS_USDC: { base: 'NS', quote: 'USDC', decimals: { base: 9, quote: 6 } },
};

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

export async function getPoolId(poolName: string): Promise<string | null> {
  const pool = await getPoolByName(poolName);
  return pool?.pool_id || null;
}

export async function getMarketPrice(poolName: string): Promise<number | null> {
  try {
    const ticker = await deepbookIndexer.getTicker();
    return ticker[poolName]?.last_price || null;
  } catch (error) {
    console.error('[Pools] Failed to get market price:', error);
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

export async function getPoolVolume(poolName: string): Promise<PoolVolume> {
  try {
    const ticker = await deepbookIndexer.getTicker();
    const data = ticker[poolName];

    if (data) {
      const config = POOL_CONFIG[poolName];
      const baseDecimals = config?.decimals.base || 9;
      const quoteDecimals = config?.decimals.quote || 6;

      return {
        base: data.base_volume / Math.pow(10, baseDecimals),
        quote: data.quote_volume / Math.pow(10, quoteDecimals),
      };
    }

    return { base: 0, quote: 0 };
  } catch (error) {
    console.error('[Pools] Failed to get volume:', error);
    return { base: 0, quote: 0 };
  }
}

export async function getPool24hVolume(poolName: string): Promise<PoolVolume> {
  try {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - 86400;
    const volumeRaw = await deepbookIndexer.getHistoricalVolume(poolName, startTime, endTime);

    const config = POOL_CONFIG[poolName];
    const baseDecimals = config?.decimals.base || 9;
    const quoteDecimals = config?.decimals.quote || 6;

    return {
      base: volumeRaw / Math.pow(10, baseDecimals),
      quote: volumeRaw / Math.pow(10, quoteDecimals),
    };
  } catch (error) {
    console.error('[Pools] Failed to get 24h volume:', error);
    return { base: 0, quote: 0 };
  }
}

export async function isPoolActive(poolName: string): Promise<boolean> {
  try {
    const ticker = await deepbookIndexer.getTicker();
    return ticker[poolName]?.isFrozen === 0;
  } catch (error) {
    console.warn('[Pools] isPoolActive failed, assuming active:', error);
    return true;
  }
}

export function getPoolConfig(poolName: string) {
  return POOL_CONFIG[poolName] || null;
}

export function getBaseSymbol(poolName: string): string {
  return POOL_CONFIG[poolName]?.base || poolName.split('_')[0];
}

export function getQuoteSymbol(poolName: string): string {
  return POOL_CONFIG[poolName]?.quote || poolName.split('_')[1] || '';
}

export default {
  TESTNET_POOLS,
  POOL_CONFIG,
  getPools,
  getPoolByName,
  getPoolId,
  getMarketPrice,
  getAllPoolPrices,
  getPoolVolume,
  getPool24hVolume,
  isPoolActive,
  getPoolConfig,
  getBaseSymbol,
  getQuoteSymbol,
};