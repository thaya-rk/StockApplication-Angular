import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { CommonModule, NgForOf, NgOptimizedImage } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NavbarComponent,
    NgOptimizedImage,
    NgxPaginationModule,
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  stocks: any[] = [];
  page: number = 1;
  itemsPerPage: number = 5;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        console.log('Fetched stocks:', data);
      },
      error: (err) => console.error('Failed to fetch stocks', err),
    });
  }
}
