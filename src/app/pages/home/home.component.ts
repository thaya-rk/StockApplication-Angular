import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StockWebSocketService } from '../../services/stock-websocket.services';
import { StockChartComponent } from '../../components/stock-chart/stock-chart.component';
import { FallbackPriceService } from '../../services/fallback-price.service';
import { NseIndexService, StockData } from '../../services/nse-index.service';


interface PriceUpdate {
  symbol: string;
  price: number | null;
  changePercent: number | null;
  timestamp: Date;
}
declare var TradingView: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    StockChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  username = '';
  welcomeMessage = 'Welcome to Application';

  topGainers: StockData[] = [];
  topLosers: StockData[] = [];


  readonly subscribedSymbols = ['BTC/USD', 'XAU/USD', 'EUR/USD'];
  private pricesMap = new Map<string, PriceUpdate>();


  constructor(
    private authService: AuthService,
    private router: Router,
    private stockWebSocket: StockWebSocketService,
    private fallbackPriceService: FallbackPriceService,
    private nseIndexService: NseIndexService

  ) {}


  ngOnInit(): void {
    this.loadUser();
    this.loadTopMovers();


    // Subscribe to real-time prices
    this.stockWebSocket.subscribeToSymbols(this.subscribedSymbols);

    // WebSocket price updates
    this.stockWebSocket.onMessage((data: any) => {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        if (parsed?.event === 'price') {
          this.handlePriceUpdate(parsed);
        }
      } catch (err) {
        console.error('Invalid price data:', data, err);
      }
    });

    // Fetch fallback prices in case WebSocket delay
    this.fetchFallbackPrices();
  }

  private loadUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => this.username = user?.data?.username || '',
      error: () => this.router.navigate(['/login'])
    });
  }

  private fetchFallbackPrices(): void {
    const missingSymbols = this.subscribedSymbols.filter(symbol => !this.pricesMap.has(symbol));
    if (missingSymbols.length === 0) {
      return;
    }

    this.fallbackPriceService.getPrices(missingSymbols).subscribe({
      next: (results) => {
        results.forEach(({ symbol, price }) => {
          if (!isNaN(price)) {
            this.pricesMap.set(symbol, {
              symbol,
              price,
              timestamp: new Date(),
              changePercent: null
            });
          } else {
            console.warn(`Fallback price invalid for ${symbol}`);
          }
        });
      },
      error: (err) => {
        console.warn('Fallback price request failed:', err);
      }
    });
  }

  private loadTopMovers(): void {
    this.nseIndexService.getNiftyData().subscribe({
      next: (stocks) => {
        const sorted = [...stocks].sort((a, b) => b.pChange - a.pChange);
        this.topGainers = sorted.slice(0, 5);
        this.topLosers = sorted.slice(-5).reverse(); // last 5 with lowest gains/losses
      },
      error: (err) => {
        console.error('Error fetching NSE data', err);
      }
    });
  }


  private handlePriceUpdate(parsed: any): void {
    const symbol = parsed.symbol;
    const newPrice = parsed.price;

    const prev = this.pricesMap.get(symbol);
    let changePercent: number | null = null;

    if (prev?.price != null && prev.price !== 0) {
      changePercent = +(((newPrice - prev.price) / prev.price) * 100).toFixed(2);
    }

    const update: PriceUpdate = {
      symbol,
      price: newPrice,
      changePercent,
      timestamp: new Date(parsed.timestamp * 1000)
    };

    this.pricesMap.set(symbol, update);

    // Update BTC chart if applicable

  }

  getAssetCategory(symbol: string): string {
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 'Crypto';
    if (symbol.includes('USD') && !symbol.includes('XAU')) return 'Forex';
    if (symbol.includes('XAU') || symbol.includes('XAG')) return 'Commodity';
    return 'Stock';
  }

  getChangePrefix(asset: PriceUpdate): string {
    return asset?.changePercent != null && asset.changePercent > 0 ? '+' : '';
  }

  getPriceClass(asset: PriceUpdate): string {
    if (asset?.changePercent == null) return 'neutral';
    return asset.changePercent > 0 ? 'positive' : 'negative';
  }

  getChangeClass(asset: PriceUpdate): string {
    if (asset?.changePercent == null) return '';
    return asset.changePercent > 0 ? 'positive' : 'negative';
  }

  get priceList(): PriceUpdate[] {
    return this.subscribedSymbols.map(symbol => {
      return this.pricesMap.get(symbol) ?? {
        symbol,
        price: null,
        changePercent: null,
        timestamp: new Date()
      };
    });
  }

  ngOnDestroy(): void {
    this.stockWebSocket.close();
  }
}
