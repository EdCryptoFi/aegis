import { DEEPBOOK_TESTNET_INDEXER, Pool, Ticker, OrderBook, Trade, OrderUpdate, PointsInfo } from './types';

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

function clearCache(): void {
  cache.clear();
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
      console.warn('[DeepBook Indexer] getPools failed, using mock:', error);
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
      console.warn('[DeepBook Indexer] getTicker failed, using mock:', error);
      return getMockTicker();
    }
  },

  async getOrderBook(poolName: string, level: number = 2, depth: number = 0): Promise<OrderBook> {
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
      console.warn('[DeepBook Indexer] getOrderBook failed, using mock:', error);
      return getMockOrderBook(poolName);
    }
  },

  async getTrades(
    poolName: string,
    limit: number = 50,
    startTime?: number,
    endTime?: number,
    makerBalanceManagerId?: string,
    takerBalanceManagerId?: string
  ): Promise<Trade[]> {
    const cacheKey = `trades:${poolName}:${limit}:${startTime}:${endTime}`;
    const cached = getCached<Trade[]>(cacheKey, 5_000);
    if (cached) return cached;

    try {
      let url = `${DEEPBOOK_TESTNET_INDEXER}/trades/${poolName}?limit=${limit}`;
      if (startTime) url += `&start_time=${startTime}`;
      if (endTime) url += `&end_time=${endTime}`;
      if (makerBalanceManagerId) url += `&maker_balance_manager_id=${makerBalanceManagerId}`;
      if (takerBalanceManagerId) url += `&taker_balance_manager_id=${takerBalanceManagerId}`;

      const trades = await fetchJSON<Trade[]>(url);
      setCache(cacheKey, trades);
      return trades;
    } catch (error) {
      console.warn('[DeepBook Indexer] getTrades failed, using mock:', error);
      return [];
    }
  },

  async getHistoricalVolume(
    poolName: string,
    startTime?: number,
    endTime?: number
  ): Promise<number> {
    const cacheKey = `volume:${poolName}:${startTime}:${endTime}`;
    const cached = getCached<number>(cacheKey, 60_000);
    if (cached !== null) return cached;

    try {
      let url = `${DEEPBOOK_TESTNET_INDEXER}/historical_volume/${poolName}`;
      const params: string[] = [];
      if (startTime) params.push(`start_time=${startTime}`);
      if (endTime) params.push(`end_time=${endTime}`);
      if (params.length > 0) url += '?' + params.join('&');

      const volumeData = await fetchJSON<Record<string, number>>(url);
      const volume = volumeData[poolName] || 0;
      setCache(cacheKey, volume);
      return volume;
    } catch (error) {
      console.warn('[DeepBook Indexer] getHistoricalVolume failed:', error);
      return 0;
    }
  },

  async getOrderUpdates(
    poolName: string,
    limit: number = 50,
    status?: 'Placed' | 'Canceled',
    balanceManagerId?: string
  ): Promise<OrderUpdate[]> {
    const cacheKey = `orderUpdates:${poolName}:${limit}:${status}:${balanceManagerId}`;
    const cached = getCached<OrderUpdate[]>(cacheKey, 5_000);
    if (cached) return cached;

    try {
      let url = `${DEEPBOOK_TESTNET_INDEXER}/order_updates/${poolName}?limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (balanceManagerId) url += `&balance_manager_id=${balanceManagerId}`;

      const updates = await fetchJSON<OrderUpdate[]>(url);
      setCache(cacheKey, updates);
      return updates;
    } catch (error) {
      console.warn('[DeepBook Indexer] getOrderUpdates failed:', error);
      return [];
    }
  },

  async getPoints(addresses: string[]): Promise<PointsInfo[]> {
    if (addresses.length === 0) return [];

    try {
      const url = `${DEEPBOOK_TESTNET_INDEXER}/get_points?addresses=${addresses.join(',')}`;
      return await fetchJSON<PointsInfo[]>(url);
    } catch (error) {
      console.warn('[DeepBook Indexer] getPoints failed:', error);
      return [];
    }
  },

  async getPortfolio(walletAddress: string): Promise<any> {
    try {
      return await fetchJSON<any>(`${DEEPBOOK_TESTNET_INDEXER}/portfolio/${walletAddress}`);
    } catch (error) {
      console.warn('[DeepBook Indexer] getPortfolio failed:', error);
      return null;
    }
  },

  async getSummary(): Promise<any[]> {
    const cacheKey = 'summary';
    const cached = getCached<any[]>(cacheKey, 30_000);
    if (cached) return cached;

    try {
      const summary = await fetchJSON<any[]>(`${DEEPBOOK_TESTNET_INDEXER}/summary`);
      setCache(cacheKey, summary);
      return summary;
    } catch (error) {
      console.warn('[DeepBook Indexer] getSummary failed:', error);
      return [];
    }
  },

  clearCache,
};

function getMockPools(): Pool[] {
  return [
    {
      pool_id: '0x5d4b4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4',
      pool_name: 'SUI_USDC',
      base_asset_id: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
      base_asset_decimals: 9,
      base_asset_symbol: 'SUI',
      base_asset_name: 'Sui',
      quote_asset_id: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
      quote_asset_decimals: 6,
      quote_asset_symbol: 'USDC',
      quote_asset_name: 'USD Coin',
      min_size: 100000000,
      lot_size: 10000000,
      tick_size: 10000000,
    },
    {
      pool_id: '0x3c5e4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4',
      pool_name: 'DEEP_USDC',
      base_asset_id: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP',
      base_asset_decimals: 6,
      base_asset_symbol: 'DEEP',
      base_asset_name: 'DeepBook Token',
      quote_asset_id: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
      quote_asset_decimals: 6,
      quote_asset_symbol: 'USDC',
      quote_asset_name: 'USD Coin',
      min_size: 100000000,
      lot_size: 10000000,
      tick_size: 10000,
    },
  ];
}

function getMockTicker(): Record<string, Ticker> {
  return {
    SUI_USDC: { base_volume: 5000000, quote_volume: 20000000, last_price: 3.97, isFrozen: 0 },
    DEEP_USDC: { base_volume: 1000000, quote_volume: 70000, last_price: 0.07, isFrozen: 0 },
    NS_SUI: { base_volume: 500000, quote_volume: 41500, last_price: 0.083, isFrozen: 0 },
  };
}

function getMockOrderBook(poolName: string): OrderBook {
  const midPrice = getMockTicker()[poolName]?.last_price || 3.97;
  const spread = midPrice * 0.005;

  return {
    timestamp: Date.now().toString(),
    bids: [
      [String((midPrice - spread).toFixed(4)), String(1000 + Math.random() * 500)],
      [String((midPrice - spread * 1.5).toFixed(4)), String(1500 + Math.random() * 500)],
      [String((midPrice - spread * 2).toFixed(4)), String(2000 + Math.random() * 500)],
      [String((midPrice - spread * 2.5).toFixed(4)), String(2500 + Math.random() * 500)],
      [String((midPrice - spread * 3).toFixed(4)), String(3000 + Math.random() * 500)],
    ],
    asks: [
      [String((midPrice + spread).toFixed(4)), String(1000 + Math.random() * 500)],
      [String((midPrice + spread * 1.5).toFixed(4)), String(1500 + Math.random() * 500)],
      [String((midPrice + spread * 2).toFixed(4)), String(2000 + Math.random() * 500)],
      [String((midPrice + spread * 2.5).toFixed(4)), String(2500 + Math.random() * 500)],
      [String((midPrice + spread * 3).toFixed(4)), String(3000 + Math.random() * 500)],
    ],
  };
}

export default deepbookIndexer;