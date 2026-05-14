'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { deepbookIndexer } from '../lib/deepbook/indexer';
import { getPoolPrice, getPoolDisplayName } from '../lib/deepbook/pools';
import { getLevelPrice, getLevelQuantity, DEEPBOOK_TESTNET_INDEXER } from '../lib/deepbook/types';

type TabType = 'trade' | 'orders' | 'book' | 'trades';

interface PoolInfo {
  name: string;
  lastPrice: number;
  baseVolume: number;
  quoteVolume: number;
  isActive: boolean;
}

export default function DeepBookPanel({ agentAddress }: DeepBookPanelProps) {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<TabType>('trade');
  const [pool, setPool] = useState('DEEP_SUI');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [book, setBook] = useState<{ bids: any[]; asks: any[]; spread: number }>({ bids: [], asks: [], spread: 0 });
  const [trades, setTrades] = useState<any[]>([]);
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);

  const isConnected = !!currentAccount;

  const loadPoolData = useCallback(async () => {
    setLoading(true);
    try {
      const [orderBook, ticker, recentTrades] = await Promise.all([
        deepbookIndexer.getOrderBook(pool, 2, 10),
        deepbookIndexer.getTicker(),
        deepbookIndexer.getTrades(pool, 10),
      ]);

      const bids = orderBook.bids.slice(0, 10).map((level, i) => ({
        price: parseFloat(getLevelPrice(level)),
        quantity: parseFloat(getLevelQuantity(level)),
        index: i,
      }));

      const asks = orderBook.asks.slice(0, 10).map((level, i) => ({
        price: parseFloat(getLevelPrice(level)),
        quantity: parseFloat(getLevelQuantity(level)),
        index: i,
      }));

      const bestBid = bids[0]?.price || 0;
      const bestAsk = asks[0]?.price || 0;
      const spread = bestBid && bestAsk ? bestAsk - bestBid : 0;

      setBook({ bids, asks, spread });

      const tickerData = ticker[pool];
      if (tickerData) {
        setPoolInfo({
          name: pool,
          lastPrice: tickerData.last_price,
          baseVolume: tickerData.base_volume,
          quoteVolume: tickerData.quote_volume,
          isActive: tickerData.isFrozen === 0,
        });

        if (!price && orderType === 'market') {
          const midPrice = (bestBid + bestAsk) / 2;
          setPrice(midPrice.toFixed(4));
        }
      }

      setTrades(recentTrades.map(t => ({
        id: t.digest,
        price: t.price,
        quantity: t.base_volume,
        side: t.type,
        time: new Date(t.timestamp).toLocaleTimeString(),
      })));

    } catch (e) {
      console.error('Failed to load pool data:', e);
    } finally {
      setLoading(false);
    }
  }, [pool]);

  useEffect(() => {
    loadPoolData();
    const interval = setInterval(loadPoolData, 15000);
    return () => clearInterval(interval);
  }, [loadPoolData]);

  useEffect(() => {
    if (orderType === 'limit' && poolInfo?.lastPrice && !price) {
      setPrice(poolInfo.lastPrice.toFixed(4));
    }
  }, [pool, orderType, poolInfo, price]);

  async function placeOrder() {
    if (!quantity) return;
    alert(`${side.toUpperCase()} ${quantity} ${getPoolDisplayName(pool)} @ ${price || 'market'}\n\nOrder placed! (Simulated)`);
  }

  async function cancelOrder(orderId: string) {
    alert(`Order ${orderId} cancelled!`);
    setOrders(orders.filter(o => o.id !== orderId));
  }

  const maxBidQty = Math.max(...book.bids.map(b => b.quantity), 1);
  const maxAskQty = Math.max(...book.asks.map(a => a.quantity), 1);

  return (
    <div className="deepbook-panel">
      <div className="panel-header">
        <h3>DeepBook Trading</h3>
        <div className="pool-status">
          {!isConnected && <span className="warning">Connect wallet</span>}
          {isConnected && poolInfo && (
            <span className={`status ${poolInfo.isActive ? 'active' : 'frozen'}`}>
              {poolInfo.isActive ? 'Live' : 'Frozen'} • ${poolInfo.lastPrice.toFixed(4)}
            </span>
          )}
        </div>
      </div>

      <div className="pool-selector">
        <label>Pool:</label>
        <select value={pool} onChange={e => {
          setPool(e.target.value);
          setPrice('');
        }}>
          <option value="DEEP_SUI">DEEP / SUI</option>
          <option value="SUI_DBUSDC">SUI / DBUSDC</option>
          <option value="WAL_DBUSDC">WAL / DBUSDC</option>
          <option value="DEEP_DBUSDC">DEEP / DBUSDC</option>
        </select>
        {poolInfo && (
          <span className="pool-info">
            Vol: {poolInfo.baseVolume.toFixed(2)} {pool.split('_')[0]}
          </span>
        )}
      </div>

      <div className="tabs">
        <button className={activeTab === 'trade' ? 'active' : ''} onClick={() => setActiveTab('trade')}>
          Trade
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          Orders
        </button>
        <button className={activeTab === 'book' ? 'active' : ''} onClick={() => setActiveTab('book')}>
          Book
        </button>
        <button className={activeTab === 'trades' ? 'active' : ''} onClick={() => setActiveTab('trades')}>
          Trades
        </button>
      </div>

      {loading && activeTab !== 'trade' && (
        <div className="loading-indicator">Loading...</div>
      )}

      {activeTab === 'trade' && (
        <div className="trade-form">
          <div className="market-price">
            <span>Market Price:</span>
            <span className="price-value">${poolInfo?.lastPrice.toFixed(4) || '-'} {pool.split('_')[1]}</span>
          </div>

          <div className="side-selector">
            <button className={side === 'buy' ? 'buy active' : 'buy'} onClick={() => setSide('buy')}>
              Buy
            </button>
            <button className={side === 'sell' ? 'sell active' : 'sell'} onClick={() => setSide('sell')}>
              Sell
            </button>
          </div>

          <div className="order-type-selector">
            <label>
              <input type="radio" checked={orderType === 'limit'} onChange={() => setOrderType('limit')} />
              Limit
            </label>
            <label>
              <input type="radio" checked={orderType === 'market'} onChange={() => setOrderType('market')} />
              Market
            </label>
          </div>

          {orderType === 'limit' && (
            <div className="input-group">
              <label>Price ({pool.split('_')[1]})</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.0000"
                step="0.0001"
              />
            </div>
          )}

          <div className="input-group">
            <label>Quantity ({pool.split('_')[0]})</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="0"
              step="0.1"
            />
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Total:</span>
              <span className={side === 'buy' ? 'buy-total' : 'sell-total'}>
                {quantity && price ? (parseFloat(quantity) * parseFloat(price)).toFixed(4) : '0.0000'} {pool.split('_')[1]}
              </span>
            </div>
            {book.spread > 0 && (
              <div className="summary-row">
                <span>Spread:</span>
                <span className="spread-value">{book.spread.toFixed(4)} ({((book.spread / ((book.bids[0]?.price + book.asks[0]?.price) / 2)) * 100).toFixed(2)}%)</span>
              </div>
            )}
          </div>

          <button
            className={`place-order-btn ${side}`}
            onClick={placeOrder}
            disabled={!isConnected || !quantity || (orderType === 'limit' && !price)}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {pool.split('_')[0]}
          </button>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="empty">No open orders</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <span className={`side ${order.side}`}>{order.side.toUpperCase()}</span>
                  <span className="price">{order.price} {pool.split('_')[1]}</span>
                  <span className="qty">x {order.quantity}</span>
                </div>
                <div className="order-meta">
                  <span className="filled">Filled: {order.filled}/{order.quantity}</span>
                  <span className="time">{order.time}</span>
                </div>
                <button className="cancel-btn" onClick={() => cancelOrder(order.id)}>
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'book' && (
        <div className="order-book">
          <div className="book-header">
            <span>Price</span>
            <span>Qty</span>
            <span>Depth</span>
          </div>
          <div className="asks">
            {book.asks.slice().reverse().map((ask, i) => (
              <div key={i} className="book-row ask">
                <span className="price">{ask.price.toFixed(4)}</span>
                <span className="qty">{ask.quantity.toFixed(2)}</span>
                <div className="depth-bar" style={{ width: `${(ask.quantity / maxAskQty) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="spread-row">
            <span>Spread: {book.spread.toFixed(4)} ({(book.spread / ((book.bids[0]?.price + book.asks[0]?.price) / 2) * 100).toFixed(2)}%)</span>
          </div>
          <div className="bids">
            {book.bids.map((bid, i) => (
              <div key={i} className="book-row bid">
                <span className="price">{bid.price.toFixed(4)}</span>
                <span className="qty">{bid.quantity.toFixed(2)}</span>
                <div className="depth-bar" style={{ width: `${(bid.quantity / maxBidQty) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="trades-list">
          {trades.length === 0 ? (
            <p className="empty">No recent trades</p>
          ) : (
            trades.map(trade => (
              <div key={trade.id} className="trade-item">
                <span className={`side ${trade.side}`}>{trade.side.toUpperCase()}</span>
                <span className="price">${trade.price.toFixed(4)}</span>
                <span className="qty">{trade.quantity.toFixed(2)}</span>
                <span className="time">{trade.time}</span>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .deepbook-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .panel-header h3 {
          color: var(--text-primary);
          margin: 0;
          font-size: 16px;
        }
        .pool-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .warning {
          color: var(--warning);
          font-size: 12px;
        }
        .status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .status.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
        .status.frozen {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .pool-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .pool-selector label {
          color: var(--text-muted);
          font-size: 12px;
        }
        .pool-selector select {
          padding: 8px 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 13px;
        }
        .pool-info {
          font-size: 11px;
          color: var(--text-muted);
        }
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .tabs button {
          padding: 8px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .tabs button.active {
          background: var(--accent-primary);
          border-color: transparent;
          color: white;
        }
        .loading-indicator {
          text-align: center;
          color: var(--text-muted);
          padding: 20px;
        }
        .trade-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .market-price {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: var(--bg-primary);
          border-radius: 8px;
        }
        .market-price span:first-child {
          color: var(--text-muted);
          font-size: 12px;
        }
        .price-value {
          color: var(--accent-primary);
          font-weight: bold;
          font-size: 14px;
        }
        .side-selector {
          display: flex;
          gap: 8px;
        }
        .side-selector button {
          flex: 1;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }
        .side-selector button.buy {
          background: var(--bg-primary);
          color: var(--text-muted);
        }
        .side-selector button.buy.active {
          background: #22c55e;
          border-color: #22c55e;
          color: white;
        }
        .side-selector button.sell {
          background: var(--bg-primary);
          color: var(--text-muted);
        }
        .side-selector button.sell.active {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }
        .order-type-selector {
          display: flex;
          gap: 16px;
        }
        .order-type-selector label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .input-group label {
          color: var(--text-muted);
          font-size: 11px;
        }
        .input-group input {
          padding: 10px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 14px;
        }
        .input-group input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .order-summary {
          padding: 12px;
          background: var(--bg-primary);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          color: var(--text-muted);
          font-size: 13px;
        }
        .buy-total { color: #22c55e; font-weight: bold; }
        .sell-total { color: #ef4444; font-weight: bold; }
        .spread-value { color: var(--text-muted); font-size: 12px; }
        .place-order-btn {
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        .place-order-btn.buy {
          background: #22c55e;
          color: white;
        }
        .place-order-btn.sell {
          background: #ef4444;
          color: white;
        }
        .place-order-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .orders-list, .trades-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        .orders-list .empty, .trades-list .empty {
          color: var(--text-muted);
          text-align: center;
          padding: 20px;
        }
        .order-item, .trade-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: var(--bg-primary);
          border-radius: 8px;
        }
        .order-info, .trade-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .order-info .side, .trade-item .side {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
        }
        .order-info .side.buy, .trade-item .side.buy { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .order-info .side.sell, .trade-item .side.sell { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .order-info .price, .trade-item .price { color: var(--text-primary); font-weight: bold; }
        .order-info .qty, .trade-item .qty { color: var(--text-muted); font-size: 12px; }
        .trade-item .time { color: var(--text-muted); font-size: 11px; }
        .order-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .order-meta .filled { color: var(--text-muted); font-size: 11px; }
        .order-meta .time { color: var(--text-muted); font-size: 10px; }
        .cancel-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid var(--danger);
          border-radius: 4px;
          color: var(--danger);
          font-size: 11px;
          cursor: pointer;
        }
        .order-book {
          font-size: 12px;
        }
        .book-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 8px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          font-size: 11px;
        }
        .asks, .bids {
          display: flex;
          flex-direction: column;
        }
        .book-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 4px 8px;
          position: relative;
        }
        .book-row .price { color: var(--text-primary); }
        .book-row .qty { color: var(--text-muted); }
        .depth-bar {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          opacity: 0.15;
          transition: width 0.3s;
        }
        .book-row.ask .depth-bar { background: #ef4444; }
        .book-row.bid .depth-bar { background: #22c55e; }
        .spread-row {
          text-align: center;
          padding: 8px;
          color: var(--text-muted);
          font-size: 11px;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}

interface DeepBookPanelProps {
  agentAddress?: string;
}