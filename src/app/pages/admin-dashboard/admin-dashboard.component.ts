// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService, Stock } from '../../services/admin.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ToastrModule
  ],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stocks: Stock[] = [];
  newStock = {
    companyName: '',
    stockPrice: 0,
    tickerSymbol: '',
    exchange: '',
    sector: '',
    ipoQty: 0,
    imageURL: '',
    desc: ''
  };

  selectedStock: Stock | null = null;
  updatedPrice: number = 0;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  searchQuery: string = '';

  formFields = [
    { id: 'companyName', model: 'companyName', label: 'Company Name', placeholder: 'Company Name', required: true, type: 'text' },
    { id: 'tickerSymbol', model: 'tickerSymbol', label: 'Ticker Symbol', placeholder: 'Ticker', required: true, type: 'text' },
    { id: 'stockPrice', model: 'stockPrice', label: 'Stock Price (₹)', placeholder: 'Price', required: true, type: 'number' },
    { id: 'exchange', model: 'exchange', label: 'Exchange', placeholder: 'Exchange', required: true, type: 'text' },
    { id: 'sector', model: 'sector', label: 'Sector', placeholder: 'Sector', required: true, type: 'text' },
    { id: 'ipoQty', model: 'ipoQty', label: 'IPO Quantity', placeholder: 'Quantity', required: true, type: 'number' },
    { id: 'imageURL', model: 'imageURL', label: 'Image URL', placeholder: 'Optional Image URL', required: false, type: 'text' }
  ];


  constructor(private adminService: AdminService,
              private router: Router,
              private toastr: ToastrService,
              private authService: AuthService) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.adminService.getAllStocks().subscribe(data => {
      this.stocks = data;
    });
  }

  onEdit(stock: any): void {
    this.selectedStock = { ...stock };
    this.updatedPrice = stock.stockPrice;
  }

  get paginatedStocks() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.stocks.slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.stocks.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  addStock() {
    this.adminService.addStock(this.newStock as Stock).subscribe(() => {
      this.loadStocks();
      this.toastr.success("Stock brought Successfully")
      this.resetNewStock();
    });
  }

  selectStock(stock: Stock) {
    this.selectedStock = stock;
    this.updatedPrice = stock.stockPrice;
  }

  updateStock() {
    if (this.selectedStock) {
      this.adminService.updateStock(this.selectedStock.stockId, this.updatedPrice).subscribe(() => {
        this.loadStocks();
        this.selectedStock = null;
        this.toastr.success("Stock Updated Successfully")

      });
    }
  }

  deleteStock(stockId: number) {
    this.adminService.deleteStock(stockId).subscribe({
      next: () => {
        this.loadStocks();
        this.toastr.success("Stock Deleted Successfully");
      },
      error: () => {
        this.toastr.error("This stock is currently held by investors and cannot be deleted.", "Delete Failed");
      }
    });
  }

  resetNewStock() {
    this.newStock = {
      companyName: '',
      stockPrice: 0,
      tickerSymbol: '',
      exchange: '',
      sector: '',
      ipoQty: 0,
      imageURL: '',
      desc: ''
    };
  }

  logout(): void {
    console.log('Logout called');
    this.adminService.logout().subscribe({
      next: () => {
        this.authService.setCurrentUser(null);
        console.log('Logout success, clearing localStorage');
        this.clearLocalStorageAndRedirect();
      },
      error: (error) => {
        console.error('Logout failed, clearing localStorage and redirecting anyway.', error);
        this.clearLocalStorageAndRedirect();
      }
    });
  }

  private clearLocalStorageAndRedirect(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
