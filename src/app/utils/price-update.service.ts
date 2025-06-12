import { Injectable, OnDestroy } from '@angular/core';
import { Holding } from '../models/portfolio.model';
import { LivePriceService } from '../services/live-price.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PriceUpdateService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private livePriceService: LivePriceService) {}

  updateHoldingPrice(holding: Holding, newPrice: number): boolean {
    const oldPrice = holding.currentPrice;

    if (oldPrice !== newPrice) {
      holding.latestPrice = newPrice;
      holding.currentPrice = newPrice;
      holding.currentValue = newPrice * holding.quantity;
      return true;
    }

    return false;
  }

  watchHoldings(holdings: Holding[], isMarketOpen: boolean): void {
    if (!isMarketOpen) return;

    const symbols = holdings.map(h => h.tickerSymbol);
    this.livePriceService.watchSymbols(symbols);

    symbols.forEach(symbol => {
      const sub = this.livePriceService.getPriceObservable(symbol).subscribe((res) => {
        if (res?.lastPrice != null) {
          const holding = holdings.find(h => h.tickerSymbol === symbol);
          if (holding) {
            this.updateHoldingPrice(holding, res.lastPrice);
          }
        }
      });
      this.subscriptions.push(sub);
    });
  }



  clear(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    this.clear();
  }
}
