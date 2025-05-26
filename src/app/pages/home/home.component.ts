import { Component, OnInit, OnDestroy } from '@angular/core';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StockWebSocketService } from '../../services/stock-websocket.services';

interface PriceUpdate {
  symbol: string;
  price: number | null;  // null means no price yet
  changePercent: number | null;
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  username = '';
  welcomeMessage = 'Welcome to Forex Application';

  // Define the exact symbols you want to track
  readonly subscribedSymbols = ['BTC/USD','XAU/USD','EUR/USD'];

  // Map to store the latest prices keyed by symbol
  private pricesMap = new Map<string, PriceUpdate>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private stockWebSocket: StockWebSocketService
  ) {}

  ngOnInit(): void {
    // Load current user info
    this.authService.getCurrentUser().subscribe({
      next: (user) => this.username = user.data.username,
      error: () => this.router.navigate(['/login'])
    });

    //subscribe to all symbols after connection
    this.stockWebSocket.subscribeToSymbols(this.subscribedSymbols);

    // Listen for incoming price messages
    this.stockWebSocket.onMessage((data: any) => {
      console.log('📨 Price Update Received:', data);

      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        if (parsed.event === 'price') {
          const symbol = parsed.symbol;
          const newPrice = parsed.price;

          // Get previous PriceUpdate for this symbol if exists
          const previousUpdate = this.pricesMap.get(symbol);

          // Calculate changePercent based on old and new price
          let changePercent: number | null = null;
          if (previousUpdate && previousUpdate.price !== null && previousUpdate.price !== 0) {
            changePercent = ((newPrice - previousUpdate.price) / previousUpdate.price) * 100;
            changePercent = +changePercent.toFixed(2); // round to 2 decimals
          }

          const update: PriceUpdate = {
            symbol: symbol,
            price: newPrice,
            timestamp: new Date(parsed.timestamp * 1000),
            changePercent: changePercent,
          };

          this.pricesMap.set(symbol, update);
        }
      } catch {
        console.error('Invalid price data:', data);
      }
    });
  }

  getAssetCategory(symbol: string): string {
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 'Crypto';
    if (symbol.includes('USD') && !symbol.includes('XAU')) return 'Forex';
    if (symbol.includes('XAU') || symbol.includes('XAG')) return 'Commodity';
    return 'Stock';
  }

  getChangePrefix(asset: any): string {
    if (!asset || asset.changePercent == null) return '';
    return asset.changePercent > 0 ? '+' : '';
  }


  getPriceClass(asset: any): string {
    if (!asset || asset.changePercent == null) return 'positive'; // default green
    return asset.changePercent > 0 ? 'positive' : 'negative';
  }

  getChangeClass(asset: any): string {
    if (!asset || asset.changePercent == null) return '';
    return asset.changePercent > 0 ? 'positive' : 'negative';
  }





  ngOnDestroy(): void {
    this.stockWebSocket.close();
  }

  // Always returns exactly 4 PriceUpdate objects (with placeholders if needed)
  get priceList(): PriceUpdate[] {
    return this.subscribedSymbols.map(symbol => {
      const priceUpdate = this.pricesMap.get(symbol);
      return priceUpdate ?? {
        symbol,
        price: null,
        changePercent: null,
        timestamp: new Date()
      };
    });
  }
}
