// portfolio.model.ts

export interface Holding {
  stockName: string;
  tickerSymbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  latestPrice?: number;
}

export interface Summary {
  companyName: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  pl: number;
  plPercent: number;
}

export interface Charge {
  chargeType: string;
  amount: number;
}

export interface StockSummary {
  portfolioValue: number;
  totalPL: number;
  portfolioGainPercent: number;
  charges: Charge[];
}
