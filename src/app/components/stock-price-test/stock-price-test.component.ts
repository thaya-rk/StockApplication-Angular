import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, interval, Subscription, Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { StockService } from '../../services/stock.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { isMarketOpen } from '../../utils/market.utils';


@Component({
  selector: 'app-stock-price-test',
  templateUrl: './stock-price-test.component.html',
  imports: [NgIf, NgForOf, NgClass],
  styleUrls: ['./stock-price-test.component.css']
})
export class StockPriceTestComponent implements OnInit, OnDestroy {
  watchlist: any[] = [];
  stockPrices: { [symbol: string]: any } = {};
  loading = true;

  private refreshSubscription!: Subscription;

  private previousPrices: { [symbol: string]: number } = {};
  updatedCells: { [symbol: string]: boolean } = {};


  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getWatchlistedStocks().subscribe({
      next: (watchlist) => {
        this.watchlist = watchlist.filter(stock => stock.tickerSymbol);
        this.loading = false;

        // Fetch prices once initially
        this.refreshPrices();

        if (isMarketOpen()) {
          // Only set interval if market is open
          this.refreshSubscription = interval(5000).subscribe(() => {
            if (isMarketOpen()) {
              this.refreshPrices();
            } else {
              console.log('Market closed. Clearing interval.');
              this.refreshSubscription.unsubscribe();
            }
          });
        } else {
          console.log('Market closed. Prices fetched once.');
        }
      },
      error: (err) => {
        console.error('Error loading watchlist:', err);
        this.loading = false;
      }
    });
  }


  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private refreshPrices(): void {
    if (this.watchlist.length === 0) return;

    const symbolRequests = this.watchlist.map(stock =>
      this.stockService.getEquityDetails(stock.tickerSymbol).pipe(
        catchError(err => {
          console.error(`Error fetching price for ${stock.tickerSymbol}:`, err);
          return of(null);
        })
      )
    );

    forkJoin(symbolRequests).subscribe({
      next: (responses) => {
        responses.forEach((res: any, i: number) => {
          const symbol = this.watchlist[i].tickerSymbol;
          const newPrice = res?.priceInfo?.lastPrice;
          const prevPrice = this.stockPrices[symbol]?.lastPrice;
          this.stockPrices[symbol] = res || {};

          if (newPrice !== prevPrice) {
            this.updatedCells[symbol] = true;
            setTimeout(() => this.updatedCells[symbol] = false, 600); // reset after animation
          }

        });
      },
      error: (err) => {
        console.error('Error refreshing prices:', err);
      }
    });
  }
}
