import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { BuySellService } from '../../services/buy-sell.service';
import { BuySellRequest } from '../../models/buy-sell-request.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from '../../navbar/navbar.component';
import {AccountService} from '../../services/account.services';
import {PortfolioService} from '../../services/portfolio.services';

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
    FormsModule,
    NgxPaginationModule,
    NavbarComponent
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  stocks: Stock[] = [];
  page = 1;
  itemsPerPage = 5;
  searchTerm = '';

  selectedStock: Stock | null = null;
  modalMode: 'buy' | 'sell' = 'buy';
  modalQuantity: number = 1;

  balance: number = 0;
  error: string = '';


  constructor(
    private stockService: StockService,
    private buySellService: BuySellService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private accountService: AccountService,
    private portfolioService:PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
    this.loadBalance();

  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data.map((stock) => ({
          ...stock,
          safeImageURL: this.sanitizer.bypassSecurityTrustUrl(stock.imageURL || 'assets/images/infy.png'),
        }));
      },
      error: (err) => {
        console.error('Error loading stocks', err);
        this.toastr.error('Failed to load stocks');
      },
    });
  }

  loadBalance() {
    this.accountService.getBalance().subscribe({
      next: res => this.balance = res,
      error: () => this.error = 'Failed to load balance'
    });
  }


  filteredStocks(): Stock[] {
    if (!this.searchTerm.trim()) return this.stocks;

    const term = this.searchTerm.toLowerCase();

    return this.stocks.filter((stock) =>
      stock.companyName.toLowerCase().includes(term) ||
      stock.tickerSymbol.toLowerCase().includes(term)
    );
  }

  openModal(stock: Stock, mode: 'buy' | 'sell'): void {
    this.selectedStock = stock;
    this.modalMode = mode;
    this.modalQuantity = 1;

  }

  closeModal(): void {
    this.selectedStock = null;
    this.modalQuantity = 1;
  }

  confirmAction(): void {
    if (!this.selectedStock || this.modalQuantity <= 0) {
      this.toastr.warning('Please enter a valid quantity');
      return;
    }

    const request: BuySellRequest = {
      stockId: this.selectedStock.stockId,
      quantity: this.modalQuantity,
    };

    const actionText = this.modalMode === 'buy' ? 'Buy' : 'Sell';
    const serviceCall = this.modalMode === 'buy'
      ? this.buySellService.buyStock(request)
      : this.buySellService.sellStock(request);

    serviceCall.subscribe({
      next: () =>{ this.toastr.success(`Stock ${actionText.toLowerCase()} successful!`);
        this.closeModal();
      },
      error: (err) => this.toastr.error(`Failed to ${actionText.toLowerCase()} stock: ${err.message}`),
    });
  }

}
