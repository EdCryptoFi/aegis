import { OrderBook } from './types';

function getLevelPrice(level: OrderBook['bids'][0]): string {
  return Array.isArray(level) ? level[0] : level.price;
}

function getLevelQuantity(level: OrderBook['bids'][0]): string {
  return Array.isArray(level) ? level[1] : level.quantity;
}

export interface SlippageResult {
  expectedPrice: number;
  worstPrice: number;
  averagePrice: number;
  slippageBps: number;
  totalCost: number;
  filledQuantity: number;
  remainingQuantity: number;
  availableLiquidity: number;
  levelsUsed: number;
}

export interface SlippageEstimate {
  expectedSlippageBps: number;
  worstCaseSlippageBps: number;
  marketImpact: number;
  isAcceptable: boolean;
}

export function calculateSlippage(
  side: 'buy' | 'sell',
  quantity: number,
  orderBook: OrderBook
): SlippageResult {
  const levels = side === 'buy' ? orderBook.asks : orderBook.bids;
  let remainingQty = quantity;
  let totalCost = 0;
  let filledQty = 0;
  let worstPrice = 0;
  let levelsUsed = 0;

  for (let i = 0; i < levels.length && remainingQty > 0; i++) {
    const level = levels[i];
    const price = parseFloat(getLevelPrice(level));
    const availableQty = parseFloat(getLevelQuantity(level));

    if (price === 0 || availableQty === 0) continue;

    const fillQty = Math.min(remainingQty, availableQty);
    totalCost += fillQty * price;
    filledQty += fillQty;
    remainingQty -= fillQty;

    if (i === 0) {
      worstPrice = price;
    } else if (side === 'buy' ? price > worstPrice : price < worstPrice) {
      worstPrice = price;
    }

    levelsUsed++;
  }

  const expectedPrice = filledQty > 0 ? totalCost / filledQty : 0;
  const bestPrice = parseFloat(getLevelPrice(levels[0] || ['0', '0']));
  const slippageBps = bestPrice > 0 ? Math.abs(expectedPrice - bestPrice) / bestPrice * 10000 : 0;

  const totalLiquidity = levels.reduce((sum, l) => sum + parseFloat(getLevelQuantity(l)), 0);

  return {
    expectedPrice: Math.round(expectedPrice * 10000) / 10000,
    worstPrice: Math.round(worstPrice * 10000) / 10000,
    averagePrice: Math.round(expectedPrice * 10000) / 10000,
    slippageBps: Math.round(slippageBps),
    totalCost: Math.round(totalCost * 10000) / 10000,
    filledQuantity: Math.round(filledQty * 10000) / 10000,
    remainingQuantity: Math.round(remainingQty * 10000) / 10000,
    availableLiquidity: Math.round(totalLiquidity * 10000) / 10000,
    levelsUsed,
  };
}

export function estimateSlippage(
  side: 'buy' | 'sell',
  quantity: number,
  orderBook: OrderBook,
  maxSlippageBps: number = 50
): SlippageEstimate {
  const result = calculateSlippage(side, quantity, orderBook);
  const firstBid = orderBook.bids[0];
  const firstAsk = orderBook.asks[0];
  const bestPrice = parseFloat(getLevelPrice(firstBid || firstAsk || ['0', '0']));

  const worstCaseSlippageBps = bestPrice > 0
    ? Math.abs(result.worstPrice - bestPrice) / bestPrice * 10000
    : 0;

  const marketImpact = result.availableLiquidity > 0
    ? (quantity / result.availableLiquidity) * 100
    : 0;

  return {
    expectedSlippageBps: result.slippageBps,
    worstCaseSlippageBps: Math.round(worstCaseSlippageBps),
    marketImpact: Math.round(marketImpact * 100) / 100,
    isAcceptable: result.slippageBps <= maxSlippageBps && result.filledQuantity >= quantity * 0.99,
  };
}

export function calculateOptimalOrderSize(
  side: 'buy' | 'sell',
  orderBook: OrderBook,
  maxSlippageBps: number = 50
): number {
  const levels = side === 'buy' ? orderBook.asks : orderBook.bids;
  let remainingQty = 0;
  const bestPrice = parseFloat(getLevelPrice(levels[0] || ['0', '0']));
  const maxSlippage = bestPrice * (maxSlippageBps / 10000);

  for (const level of levels) {
    const price = parseFloat(getLevelPrice(level));
    const availableQty = parseFloat(getLevelQuantity(level));
    const priceDiff = Math.abs(price - bestPrice);

    if (priceDiff <= maxSlippage) {
      remainingQty += availableQty;
    } else {
      break;
    }
  }

  return remainingQty;
}

export function getEffectiveSpread(orderBook: OrderBook): number {
  const bestBid = parseFloat(getLevelPrice(orderBook.bids[0] || ['0', '0']));
  const bestAsk = parseFloat(getLevelPrice(orderBook.asks[0] || ['0', '0']));

  if (bestBid === 0 || bestAsk === 0) return 0;

  return ((bestAsk - bestBid) / ((bestBid + bestAsk) / 2)) * 10000;
}

export function getMidPrice(orderBook: OrderBook): number {
  const bestBid = parseFloat(getLevelPrice(orderBook.bids[0] || ['0', '0']));
  const bestAsk = parseFloat(getLevelPrice(orderBook.asks[0] || ['0', '0']));

  if (bestBid === 0 && bestAsk === 0) return 0;
  if (bestBid === 0) return bestAsk;
  if (bestAsk === 0) return bestBid;

  return (bestBid + bestAsk) / 2;
}

export default { calculateSlippage, estimateSlippage, calculateOptimalOrderSize, getEffectiveSpread, getMidPrice };