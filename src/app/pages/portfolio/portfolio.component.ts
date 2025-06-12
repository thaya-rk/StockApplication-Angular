import {Component, OnDestroy, OnInit} from '@angular/core';
import { PortfolioService } from '../../services/portfolio.services';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {FormsModule} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import {Holding} from '../../models/portfolio.model'
import  { LivePriceService } from '../../services/live-price.service'
import { Subscription } from 'rxjs';
import { isMarketOpen } from '../../utils/market.utils';
import {PriceUpdateService} from '../../utils/price-update.service';
import {StockService} from '../../services/stock.service';


@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.component.html',
  imports: [
    NgForOf,
    NgIf,
    NavbarComponent,
    DecimalPipe,
    FormsModule,
    MatTooltipModule,
    NgClass
  ],
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit,OnDestroy {

  holdings: Holding[] = [];
  subscriptions: Subscription[] = [];

  searchText: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private portfolioService: PortfolioService,
    private livePriceService: LivePriceService,
    private priceUpdateService: PriceUpdateService,
    private stockService:StockService
  ) {}

  ngOnInit(): void {
    console.log('PortfolioComponent initialized');

    this.portfolioService.getHoldings().subscribe({
      next: (data) => {
        this.holdings = data;
        const symbols = this.holdings.map(h => h.tickerSymbol);
        const marketOpen = isMarketOpen();

        // Fetch initial price for all symbols immediately
        symbols.forEach(symbol => {
          this.stockService.getEquityDetails(symbol).subscribe(res => {
            if (res?.lastPrice != null) {
              const holding = this.holdings.find(h => h.tickerSymbol === symbol);
              if (holding) {
                const updated = this.priceUpdateService.updateHoldingPrice(holding, res.lastPrice);
                if (updated) {
                  this.holdings = [...this.holdings];
                  console.log(`Initial price set for ${symbol}: ${res.lastPrice}`);
                }
              }
            }
          });
        });

        // Then, if market is open, subscribe to live price updates
        if (marketOpen) {
          this.livePriceService.watchSymbols(symbols);
        }

        symbols.forEach(symbol => {
          const sub = this.livePriceService.getPriceObservable(symbol).subscribe((res) => {
            if (res?.lastPrice != null) {
              const holding = this.holdings.find(h => h.tickerSymbol === symbol);
              if (holding) {
                const updated = this.priceUpdateService.updateHoldingPrice(holding, res.lastPrice);
                if (updated) {
                  console.log(`Live price updated for ${symbol}: ${res.lastPrice}`);
                  this.holdings = [...this.holdings];
                }
              }
            }
          });

          if (!marketOpen) {
            sub.add(() => {
              setTimeout(() => sub.unsubscribe(), 1000);
            });
          }

          this.subscriptions.push(sub);
        });
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('Component destroyed');

  }

  get portfolioValue(): number {
    return this.holdings.reduce((sum, h) => sum + h.currentValue, 0);
  }

  get portfolioGain(): number {
    return this.holdings.reduce(
      (gain, h) => gain + (h.currentPrice - h.avgBuyPrice) * h.quantity,
      0
    );
  }

  get portfolioGainPercent(): number {
    const totalInvestment = this.holdings.reduce(
      (sum, h) => sum + h.avgBuyPrice * h.quantity, 0);
    return totalInvestment ? (this.portfolioGain / totalInvestment) * 100 : 0;
  }

  getProfitLoss(holding: Holding): number {
    return (holding.currentPrice - holding.avgBuyPrice) * holding.quantity;
  }

  getProfitLossPercent(holding: any): number {
    const { avgBuyPrice, currentPrice } = holding;
    if (!avgBuyPrice) return 0;
    return ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100;
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  clearSort() {
    this.sortColumn = '';
    this.sortDirection = 'asc';
  }

  get filteredHoldings(): Holding[] {
    const query = this.searchText.trim().toLowerCase();

    let filtered = this.holdings.filter(h =>
      h.stockName.toLowerCase().includes(query)
    );

    // Sorting logic
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        let aValue = 0, bValue = 0;

        if (this.sortColumn === 'pl') {
          aValue = this.getProfitLoss(a);
          bValue = this.getProfitLoss(b);
        } else if (this.sortColumn === 'value') {
          aValue = a.currentValue;
          bValue = b.currentValue;
        }

        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }

}
