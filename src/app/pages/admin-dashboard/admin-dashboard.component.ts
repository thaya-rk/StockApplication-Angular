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
    this.adminService.deleteStock(stockId).subscribe(() => {
      this.loadStocks();
      this.toastr.success("Stock Deleted Successfully")

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
