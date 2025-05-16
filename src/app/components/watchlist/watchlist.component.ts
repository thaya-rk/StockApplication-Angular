import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { CommonModule, NgForOf } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BuySellRequest} from '../../models/buy-sell-request.model';
import { BuySellService } from '../../services/buy-sell.service';
import { ToastrService } from 'ngx-toastr';


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
    FormsModule,
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  stocks: Stock[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';


  constructor(private stockService: StockService,
              private sanitizer: DomSanitizer,
              private buySellService:BuySellService,
              private toastr: ToastrService
  ) {}

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


  buyStock(stockId: number) {
    const qtyStr = prompt('Enter quantity to buy:', '1');
    const quantity = qtyStr ? parseInt(qtyStr, 10) : 0;
    if (quantity > 0) {
      const request: BuySellRequest = { stockId, quantity };
      this.buySellService.buyStock(request).subscribe({
        next: () => this.toastr.success('Stock bought successfully'),
        error: err => this.toastr.error('Failed to buy stock: ' + err.message)
      });
    } else {
      this.toastr.warning('Invalid quantity');
    }
  }

  sellStock(stockId: number) {
    const qtyStr = prompt('Enter quantity to sell:', '1');
    const quantity = qtyStr ? parseInt(qtyStr, 10) : 0;
    if (quantity > 0) {
      const request: BuySellRequest = { stockId, quantity };
      this.buySellService.sellStock(request).subscribe({
        next: () => this.toastr.success('Stock sold successfully'),
        error: err => this.toastr.error('Failed to sell stock: ' + err.message)
      });
    } else {
      this.toastr.warning('Invalid quantity');
    }
  }

  filteredStocks() {
    if (!this.searchTerm) return this.stocks;
    return this.stocks.filter(stock =>
      stock.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      stock.tickerSymbol.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
