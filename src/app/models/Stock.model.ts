export interface Stock {
  id: number;
  companyName: string;
  tickerSymbol: string;
  price: number;
  quantity: number;
  exchange?: string;
  sector?: string;
  ipoQty?: number;
  imageURL?: string;
  description?: string;
  priceChange?: number;
  pChange?: number;

}
