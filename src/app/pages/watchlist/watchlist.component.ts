import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { BuySellService } from '../../services/buy-sell.service';
import { BuySellRequest } from '../../models/buy-sell-request.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import {Holding} from '../../models/portfolio.model';
import  { LivePriceService } from '../../services/live-price.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {AccountService} from '../../services/account.services';
import {PortfolioService} from '../../services/portfolio.services';
import {Charges} from '../../models/charges.model';
import {AuthService} from '../../services/auth.service';
import {forkJoin, Subscription} from 'rxjs';
import {isMarketOpen} from '../../utils/market.utils';

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
type SelectableStock = Stock & { selected: boolean };



@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NavbarComponent,
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  holdings: Holding[] = [];
  existingQuantity: number = 0;

  page = 1;
  itemsPerPage = 10;

  watchlistedStocks: Stock[] = [];
  showAddToWatchlistModal = false;
  unwatchlistedStocks: SelectableStock[] = [];
  searchTerm: string = '';


  selectedStock: Stock | null = null;
  modalMode: 'buy' | 'sell' = 'buy';
  modalQuantity: number = 1;
  addWatchlistSearch: string = '';

  toggleView: 'all' | 'watchlist' = 'watchlist';
  stocks:    any[]       = [];

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

  isVerified: boolean = false;

  constructor(
    private stockService: StockService,
    private buySellService: BuySellService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private accountService: AccountService,
    private portfolioService:PortfolioService,
    private authService: AuthService,
    private livePriceService:LivePriceService,
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadStocks();
    this.loadBalance();
    this.loadHoldings();
    this.loadWatchlistedStocks();

    this.checkEmailVerification();
  }

  loadWatchlistedStocks(): void {
    this.stockService.getWatchlistedStocks().subscribe({
      next: (data) => {
        this.watchlistedStocks = data;
      },
      error: (err) => console.error('Error loading watchlisted stocks', err),
    });
  }
  loadUnwatchlistedStocks(): void {
    forkJoin({
      all: this.stockService.getAllStocks(),
      fav: this.stockService.getWatchlistedStocks()
    }).subscribe({
      next: ({ all, fav }) => {
        const favIds = new Set(fav.map(s => s.stockId));
        this.unwatchlistedStocks = all
          .filter(stock => !favIds.has(stock.stockId))
          .map(stock => ({ ...stock, selected: false })); // 🔥 Add `selected`
      },
      error: (err) => console.error('Error loading unwatchlisted stocks', err),
    });
  }

  areAllSelected(): boolean {
    return this.unwatchlistedStocks.every(s => s.selected);
  }

  toggleSelectAll(selectAll: boolean): void {
    this.unwatchlistedStocks.forEach(stock => stock.selected = selectAll);
  }



  openAddToWatchlist(): void {
    this.showAddToWatchlistModal = true;
    this.loadUnwatchlistedStocks();

    forkJoin({
      all: this.stockService.getAllStocks(),
      fav: this.stockService.getWatchlistedStocks()
    }).subscribe({
      next: ({ all, fav }) => {
        const favIds = new Set(fav.map(s => s.stockId));
        this.unwatchlistedStocks = all
          .filter(s => !favIds.has(s.stockId))
          .map(s => ({ ...s, selected: false }));
      },
      error: () => this.toastr.error('Failed to load stocks for selection'),
    });
  }

  addSelectedStocksToWatchlist(): void {
    const selectedIds = this.unwatchlistedStocks
      .filter(s => s.selected)
      .map(s => s.stockId);

    if (selectedIds.length === 0) {
      this.toastr.warning('No stocks selected');
      return;
    }

    const requests = selectedIds.map(id =>
      this.stockService.addToWatchlist(id)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.toastr.success('Stocks added to watchlist');
        this.onStocksAdded();
      },
      error: () => this.toastr.error('Failed to add some stocks'),
    });
  }

  filteredUnwatchlistedStocks(): SelectableStock[] {
    if (!this.addWatchlistSearch.trim()) return this.unwatchlistedStocks;
    const term = this.addWatchlistSearch.toLowerCase();
    return this.unwatchlistedStocks.filter(
      s =>
        s.companyName.toLowerCase().includes(term) ||
        s.tickerSymbol.toLowerCase().includes(term)
    );
  }



  // Called when modal is closed
  closeAddToWatchlist(): void {
    this.showAddToWatchlistModal = false;
  }

  // Called when stocks are added from modal
  onStocksAdded(): void {
    this.loadWatchlistedStocks();
    this.closeAddToWatchlist();
  }



  loadStocks(): void {
    forkJoin({
      all: this.stockService.getAllStocks(),
      fav: this.stockService.getWatchlistedStocks()
    }).subscribe({
      next: ({ all, fav }) => {
        const favIds     = new Set(fav.map(f => f.stockId));
        const favSymbols = fav.map(f => f.tickerSymbol);

        // build table
        this.stocks = all.map(s => ({
          ...s,
          safeImageURL: this.sanitizer.bypassSecurityTrustUrl(s.imageURL),
          isWatchlisted: favIds.has(s.stockId)
        }));

        if (isMarketOpen()) {
          this.livePriceService.watchSymbols(favSymbols);

          favSymbols.forEach(sym => {
            this.livePriceService.getPriceObservable(sym).subscribe(price => {
              if (price?.lastPrice != null) {
                const i = this.stocks.findIndex(s => s.tickerSymbol === sym);
                if (i !== -1) {
                  this.stocks[i] = { ...this.stocks[i],
                    stockPrice:  price.lastPrice,
                    priceChange: price.change,
                    pChange:     price.pChange };
                  this.stocks = [...this.stocks];
                }
              }
            });
          });
        }

        else if (favSymbols.length) {
          this.livePriceService.fetchPrices(favSymbols).subscribe(responses => {
            responses.forEach(res => {
              if (res) {
                const i = this.stocks.findIndex(s => s.tickerSymbol === res.symbol);
                if (i !== -1) {
                  this.stocks[i] = { ...this.stocks[i],
                    stockPrice:  res.lastPrice,
                    priceChange: res.change,
                    pChange:     res.pChange };
                }
              }
            });
            this.stocks = [...this.stocks];   // trigger change detection once
          });
        }
      },
      error: () => this.toastr.error('Error loading data')
    });
  }


  /** Keep 1-to-1 map of visible symbol → Subscription */
  private liveSubs = new Map<string, Subscription>();

  /** Called whenever page/search/toggle changes */
  private refreshPagePrices(): void {
    // which rows are on the screen right now?
    const visible = this.filteredStocks()
      .slice((this.page - 1) * this.itemsPerPage,
        this.page * this.itemsPerPage);

    const visibleSymbols = visible.map(s => s.tickerSymbol);

    /* ───  A.  Dispose subscriptions that scrolled off screen  ─── */
    for (const [sym, sub] of this.liveSubs) {
      if (!visibleSymbols.includes(sym)) {
        sub.unsubscribe();
        this.liveSubs.delete(sym);
      }
    }

    visibleSymbols.forEach(sym => {
      if (!this.liveSubs.has(sym)) {
        const sub = this.livePriceService
          .getPriceObservable(sym)
          .subscribe(price => {
            if (price?.lastPrice != null) {
              const i = this.stocks.findIndex(s => s.tickerSymbol === sym);
              if (i !== -1) {
                this.stocks[i] = {
                  ...this.stocks[i],
                  stockPrice : price.lastPrice,
                  priceChange: price.change,
                  pChange    : price.pChange
                };
                this.stocks = [...this.stocks];      // trigger CD
              }
            }
          });
        this.liveSubs.set(sym, sub);
      }
    });

    /* ───  C.  Tell LivePriceService to poll only these symbols  ─── */
    this.livePriceService.watchSymbols(visibleSymbols);
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
        console.log("Holdings loaded:", this.holdings);
      },
      error: (err) => {
        console.error('Failed to load holdings', err);
        this.toastr.error('Could not load holdings');
      }
    });
  }

  filteredStocks(): any[] {
    const base = this.toggleView === 'watchlist'
      ? this.stocks.filter(s => s.isWatchlisted)
      : this.stocks;

    if (!this.searchTerm?.trim()) { return base; }

    const term = this.searchTerm.toLowerCase();
    return base.filter(s =>
      s.companyName.toLowerCase().includes(term) ||
      s.tickerSymbol.toLowerCase().includes(term)
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
  checkEmailVerification(): void {
    console.log('checkEmailVerification() called');
    this.authService.isUserVerified().subscribe({
      next: (verified) => {
        this.isVerified = verified;
        console.log('User verified:', this.isVerified);
      },
      error: () => {
        this.toastr.error('Failed to check email verification');
        this.isVerified = false;
      }
    });
  }


}
