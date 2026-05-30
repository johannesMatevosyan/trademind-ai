export type PriceDirection = 'up' | 'down';

export type MarketTicker = {
  symbol: string;
  price: number;
  direction: PriceDirection;
};
