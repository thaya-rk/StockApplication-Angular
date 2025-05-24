import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StockWebSocketService } from '../../services/stock-websocket.services';

interface PriceUpdate {
  symbol: string;
  exchange?: string;
  type?: string;
  currency?: string;
  currency_base?: string;
  currency_quote?: string;
  price: number;
  timestamp: Date;
  day_volume?: number;
  bid?: number;
  ask?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  username: string = '';
  welcomeMessage = 'Welcome to Forex Application';

  prices: PriceUpdate[] = [];
  latestPrice: PriceUpdate | null = null;


  constructor(
    private authService: AuthService,
    private router: Router,
    private stockWebSocket: StockWebSocketService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.username = user.data.username;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
        this.router.navigate(['/login']);
      }
    });

    this.stockWebSocket.onMessage((data: any) => {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        if (parsed.event === 'price') {
          const priceUpdate: PriceUpdate = {
            symbol: parsed.symbol,
            exchange: parsed.exchange,
            type: parsed.type,
            price: parsed.price,
            timestamp: new Date(parsed.timestamp * 1000),
            day_volume: parsed.day_volume,
            bid: parsed.bid,
            ask: parsed.ask,
          };

          if (parsed.currency_base && parsed.currency_quote) {
            priceUpdate.currency_base = parsed.currency_base;
            priceUpdate.currency_quote = parsed.currency_quote;
          } else if (parsed.currency) {
            priceUpdate.currency = parsed.currency;
          }

          this.latestPrice = priceUpdate;  // Just overwrite the latest price
        }
      } catch (e) {
        console.error('Invalid price data:', data);
      }
    });


  }

  ngOnDestroy(): void {
    this.stockWebSocket.close();
  }
}
