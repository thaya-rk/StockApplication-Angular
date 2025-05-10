import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { CommonModule, NgForOf } from '@angular/common';
import {NavbarComponent} from '../../navbar/navbar.component';

@Component({
  selector: 'app-watchlist',
  standalone: true, // ✅ Make it a standalone component
  imports: [CommonModule, NgForOf, NavbarComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  stocks: any[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => this.stocks = data,
      error: (err) => console.error('Failed to fetch stocks', err)
    });
  }
}
