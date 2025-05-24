import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { BuySellService } from '../../services/buy-sell.service';
import { BuySellRequest } from '../../models/buy-sell-request.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import {Holding} from '../../models/portfolio.model';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {AccountService} from '../../services/account.services';
import {PortfolioService} from '../../services/portfolio.services';
import {Charges} from '../../models/charges.model';

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
  holdings: Holding[] = [];
  existingQuantity: number = 0;

  stocks: Stock[] = [];
  page = 1;
  itemsPerPage = 20;
  searchTerm = '';

  selectedStock: Stock | null = null;
  modalMode: 'buy' | 'sell' = 'buy';
  modalQuantity: number = 1;

  balance: number = 0;
  error: string = '';

  selectedChargesStock: any = null;
  chargesQuantity: number = 1;
  transactionCharges: Charges | null = null;
  showChargesModal: boolean = false;
  isLoadingCharges: boolean = false;

  chargeKeys: { key: keyof Charges; label: string }[] = [
    { key: 'brokerage', label: 'Brokerage' },
    { key: 'stampDuty', label: 'Stamp Duty' },
    { key: 'transactionTax', label: 'Transaction Tax' },
    { key: 'sebiCharges', label: 'SEBI Charges' },
    { key: 'gst', label: 'GST' }
  ];




  //Animations
  closing = false;
  closingCharges = false;

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
    this.loadHoldings();

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

  loadHoldings(): void {
    this.portfolioService.getHoldings().subscribe({
      next: (data) => {
        this.holdings = data;
        console.log("Holdings loaded:", this.holdings);  // Debug
      },
      error: (err) => {
        console.error('Failed to load holdings', err);
        this.toastr.error('Could not load holdings');
      }
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
    this.closing = false;


    if (mode === 'sell') {
      const holding = this.holdings.find(
        (h) => {
          const isMatch = h.stockName === stock.companyName;
          if (isMatch) {
            console.log("fetched stock from holding: " + h.stockName);
            console.log("Selected stock: " + stock.companyName);
          }else {
            console.log("fetched stock from holding: " + h.stockName);
            console.log("Selected stock: " + stock.companyName);
          }
          return isMatch;
        }
      );
      this.existingQuantity = holding ? holding.quantity : 0;
    }

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

  openChargesModal(stock: any) {
    this.selectedChargesStock = stock;
    this.chargesQuantity =this.modalQuantity && this.modalQuantity > 0 ? this.modalQuantity : 1;
    this.transactionCharges = null;
    this.showChargesModal = true;
    this.fetchCharges();
  }

  closeChargesModal() {
    this.showChargesModal = false;
    this.selectedChargesStock = null;
    this.transactionCharges = null;
  }

  fetchCharges() {
    if (!this.selectedChargesStock || !this.chargesQuantity || this.chargesQuantity <= 0) {
      return;
    }

    const stockId = this.selectedChargesStock.stockId;

    this.isLoadingCharges = true;

    console.log(stockId +" "+this.chargesQuantity)
    this.portfolioService.getTransactionCharges(stockId, this.chargesQuantity)
      .subscribe({
        next: (charges) => {
          this.transactionCharges = charges;
          this.isLoadingCharges = false;
          console.log('Received transaction charges:', this.transactionCharges);
        },
        error: (err) => {
          console.error('Failed to fetch charges', err);
          this.isLoadingCharges = false;
        }
      });
  }




}
