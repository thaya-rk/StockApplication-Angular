import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  readonly subscribedSymbols = ['BTC/USD', 'AAPL', 'EUR/USD','INFY'];

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

    // Listen for incoming price messages
    this.stockWebSocket.onMessage((data: any) => {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        if (parsed.event === 'price') {
          const update: PriceUpdate = {
            symbol: parsed.symbol,
            price: parsed.price,
            timestamp: new Date(parsed.timestamp * 1000),
            changePercent: +(Math.random() * 10 - 5).toFixed(2), // Simulated changePercent
          };

          this.pricesMap.set(update.symbol, update);
        }
      } catch {
        console.error('Invalid price data:', data);
      }
    });
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
