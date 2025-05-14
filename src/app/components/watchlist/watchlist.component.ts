import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { CommonModule, NgForOf } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Stock {
  stockId: number;
  stockPrice: number;
  companyName: string;
  tickerSymbol: string;
  exchange: string;
  sector: string;
  ipoQty: number;
  desc: string | null;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
  safeImageURL?: SafeUrl;
}

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NavbarComponent,
    NgxPaginationModule,
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  stocks: Stock[] = [];
  page: number = 1;
  itemsPerPage: number = 5;

  constructor(private stockService: StockService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data.map(stock => ({
          ...stock,
          safeImageURL: this.sanitizer.bypassSecurityTrustUrl(stock.imageURL)
        }));
        console.log('Fetched stocks:', this.stocks);
      },
      error: (err) => console.error('Failed to fetch stocks', err),
    });
  }

}
