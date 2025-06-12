import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, interval, BehaviorSubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { StockService } from './stock.service';

@Injectable({
  providedIn: 'root'
})
export class LivePriceService {
  private prices: { [symbol: string]: any } = {};
  private priceSubjects: { [symbol: string]: BehaviorSubject<any> } = {};

  constructor(private stockService: StockService) {}

  // Start periodic updates for given symbols
  watchSymbols(symbols: string[], intervalMs = 4000): void {
    interval(intervalMs).pipe(
      switchMap(() => this.fetchPrices(symbols))
    ).subscribe();
  }

  // Expose observable for individual stock price
  getPriceObservable(symbol: string): Observable<any> {
    if (!this.priceSubjects[symbol]) {
      this.priceSubjects[symbol] = new BehaviorSubject<any>(null);
    }
    return this.priceSubjects[symbol].asObservable();
  }

  // Fetch latest prices and update subjects
  public fetchPrices(symbols: string[]): Observable<any[]> {
    const requests = symbols.map(symbol =>
      this.stockService.getEquityDetails(symbol).pipe(
        catchError(err => {
          console.error(`Error fetching ${symbol}`, err);
          return of(null);
        })
      )
    );

    return forkJoin(requests).pipe(
      switchMap((responses) => {
        responses.forEach((res, idx) => {
          const symbol = symbols[idx];
          if (res) {
            this.prices[symbol] = res;
            if (this.priceSubjects[symbol]) {
              this.priceSubjects[symbol].next(res);
            } else {
              this.priceSubjects[symbol] = new BehaviorSubject(res);
            }
          }
        });
        return of(responses);
      })
    );
  }
}
