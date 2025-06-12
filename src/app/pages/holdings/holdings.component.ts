import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HoldingsServices } from '../../services/holdings.services';
import { Holding } from '../../models/portfolio.model';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { PortfolioDonutChartComponent } from '../../components/portfolio-donut-chart/portfolio-donut-chart.component';
import { PortfolioStackedBarChartComponent } from '../../components/portfolio-stacked-bar-chart/portfolio-stacked-bar-chart.component';
import { PriceUpdateService } from '../../utils/price-update.service';
import { isMarketOpen } from '../../utils/market.utils';
import { LivePriceService } from '../../services/live-price.service';
import { StockService } from '../../services/stock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    DecimalPipe,
    PortfolioDonutChartComponent,
    PortfolioStackedBarChartComponent
  ],
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css'
})
export class HoldingsComponent implements OnInit, OnDestroy {

  holdings: Holding[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private holdingService:   HoldingsServices,
    private priceUpdateService: PriceUpdateService,
    private livePriceService: LivePriceService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.holdingService.getHoldings().subscribe({
      next: data => {
        this.holdings = data;
        const symbols = this.holdings.map(h => h.tickerSymbol);
        const marketOpen = isMarketOpen();

        /* ------------ 1. One-shot fetch for each symbol ----------- */
        symbols.forEach(sym => {
          this.stockService.getEquityDetails(sym).subscribe(res => {
            if (res?.lastPrice != null) {
              const h = this.holdings.find(x => x.tickerSymbol === sym);
              if (h && this.priceUpdateService.updateHoldingPrice(h, res.lastPrice)) {
                this.holdings = [...this.holdings];   // trigger CD
              }
            }
          });
        });

        /* ------------ 2. Live updates if market is open ----------- */
        if (marketOpen) {
          this.livePriceService.watchSymbols(symbols);

          symbols.forEach(sym => {
            const sub = this.livePriceService.getPriceObservable(sym).subscribe(res => {
              if (res?.lastPrice != null) {
                const h = this.holdings.find(x => x.tickerSymbol === sym);
                if (h && this.priceUpdateService.updateHoldingPrice(h, res.lastPrice)) {
                  this.holdings = [...this.holdings];
                }
              }
            });
            this.subscriptions.push(sub);
          });
        }
      },
      error: err => console.error('Error fetching holdings:', err)
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.priceUpdateService.clear();
  }

  /* ---------- helper getters ---------- */

  getTotalInvestment(): number {
    return this.holdings.reduce(
      (acc, h) => acc + h.avgBuyPrice * h.quantity, 0);
  }

  getCurrentValue(): number {
    return this.holdings.reduce(
      (acc, h) => acc + h.currentValue, 0);
  }

  getProfitLoss(h: Holding): number {
    return (h.currentPrice - h.avgBuyPrice) * h.quantity;
  }
}
