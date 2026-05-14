import { DEEPBOOK_TESTNET_INDEXER, Pool, Ticker, OrderBook, Trade } from './types';

const DEFAULT_CACHE_TTL = 30_000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string, ttl: number = DEFAULT_CACHE_TTL): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const deepbookIndexer = {
  async getPools(): Promise<Pool[]> {
    const cacheKey = 'pools';
    const cached = getCached<Pool[]>(cacheKey);
    if (cached) return cached;

    try {
      const pools = await fetchJSON<Pool[]>(`${DEEPBOOK_TESTNET_INDEXER}/get_pools`);
      setCache(cacheKey, pools);
      return pools;
    } catch (error) {
      console.warn('[DeepBook] getPools failed:', error);
      return getMockPools();
    }
  },

  async getTicker(): Promise<Record<string, Ticker>> {
    const cacheKey = 'ticker';
    const cached = getCached<Record<string, Ticker>>(cacheKey, 10_000);
    if (cached) return cached;

    try {
      const ticker = await fetchJSON<Record<string, Ticker>>(`${DEEPBOOK_TESTNET_INDEXER}/ticker`);
      setCache(cacheKey, ticker);
      return ticker;
    } catch (error) {
      console.warn('[DeepBook] getTicker failed:', error);
      return getMockTicker();
    }
  },

  async getOrderBook(poolName: string, level: number = 2, depth: number = 10): Promise<OrderBook> {
    const cacheKey = `orderbook:${poolName}:${level}:${depth}`;
    const cached = getCached<OrderBook>(cacheKey, 5_000);
    if (cached) return cached;

    try {
      const book = await fetchJSON<OrderBook>(
        `${DEEPBOOK_TESTNET_INDEXER}/orderbook/${poolName}?level=${level}&depth=${depth}`
      );
      setCache(cacheKey, book);
      return book;
    } catch (error) {
      console.warn('[DeepBook] getOrderBook failed:', error);
      return getMockOrderBook();
    }
  },

  async getTrades(poolName: string, limit: number = 20): Promise<Trade[]> {
    const cacheKey = `trades:${poolName}:${limit}`;
    const cached = getCached<Trade[]>(cacheKey, 10_000);
    if (cached) return cached;

    try {
      const trades = await fetchJSON<Trade[]>(
        `${DEEPBOOK_TESTNET_INDEXER}/trades/${poolName}?limit=${limit}`
      );
      setCache(cacheKey, trades);
      return trades;
    } catch (error) {
      console.warn('[DeepBook] getTrades failed:', error);
      return [];
    }
  },

  async getHistoricalVolume(poolName: string): Promise<{ base: number; quote: number }> {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - 86400;

    try {
      const url = `${DEEPBOOK_TESTNET_INDEXER}/historical_volume/${poolName}?start_time=${startTime}&end_time=${endTime}`;
      const data = await fetchJSON<Record<string, number>>(url);
      return { base: data[poolName] || 0, quote: 0 };
    } catch (error) {
      console.warn('[DeepBook] getHistoricalVolume failed:', error);
      return { base: 0, quote: 0 };
    }
  },

  clearCache() {
    cache.clear();
  },
};

function getMockPools(): Pool[] {
  return [
    {
      pool_id: '0x5d4b4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4',
      pool_name: 'DEEP_SUI',
      base_asset_id: '0xdee7...::deep::DEEP',
      base_asset_decimals: 6,
      base_asset_symbol: 'DEEP',
      base_asset_name: 'DeepBook Token',
      quote_asset_id: '0x2::sui::SUI',
      quote_asset_decimals: 9,
      quote_asset_symbol: 'SUI',
      quote_asset_name: 'Sui',
      min_size: 100000000,
      lot_size: 10000000,
      tick_size: 10000000,
    },
  ];
}

function getMockTicker(): Record<string, Ticker> {
  return {
    DEEP_SUI: { base_volume: 20, quote_volume: 0.62, last_price: 0.031, isFrozen: 0 },
    SUI_DBUSDC: { base_volume: 131.2, quote_volume: 158.4, last_price: 1.21, isFrozen: 0 },
  };
}

function getMockOrderBook(): OrderBook {
  return {
    timestamp: Date.now().toString(),
    bids: [
      ['0.03000', '10'],
      ['0.02995', '15'],
      ['0.02990', '20'],
      ['0.02985', '25'],
      ['0.02980', '30'],
    ],
    asks: [
      ['0.03020', '10'],
      ['0.03025', '15'],
      ['0.03030', '20'],
      ['0.03035', '25'],
      ['0.03040', '30'],
    ],
  };
}

export default deepbookIndexer;