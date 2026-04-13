import type { BuyRound, StockWithStats, Stock, RealizedTrade } from './types';

export function calcStats(stock: Stock, rounds: BuyRound[], sells: RealizedTrade[] = []): StockWithStats {
  const total_bought_shares = rounds.reduce((acc, r) => acc + r.shares, 0);
  const total_sold_shares = sells.reduce((acc, s) => acc + s.shares, 0);
  const active_shares = Math.max(0, total_bought_shares - total_sold_shares);
  
  const total_invested_all_time = rounds.reduce((acc, r) => acc + r.price * r.shares, 0);
  const avg_cost = total_bought_shares > 0 ? total_invested_all_time / total_bought_shares : 0;
  
  // Actually invested in current holdings
  const current_invested = active_shares * avg_cost;
  
  const dividend_per_share = stock.dividend_per_share ?? 0;
  const total_dividend = dividend_per_share * active_shares;
  
  const dividend_yield_pct = avg_cost > 0 ? (dividend_per_share / avg_cost) * 100 : 0;
  const target_price = stock.target_price ?? 0;
  
  // Expected profit for current holdings
  const expected_profit = (target_price - avg_cost) * active_shares + total_dividend;
  
  const total_realized_profit = sells.reduce((acc, s) => acc + s.profit, 0);

  return {
    ...stock,
    buy_rounds: rounds,
    realized_trades: sells,
    total_shares: active_shares, // We redefine total_shares to mean "Active Shares" for UI simplicity
    total_invested: current_invested,
    avg_cost,
    total_dividend,
    dividend_yield_pct,
    expected_profit,
    active_shares,
    total_realized_profit,
  };
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number): string {
  return `฿${formatNumber(value)}`;
}
