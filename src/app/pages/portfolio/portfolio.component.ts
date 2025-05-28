import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.services';
import {DecimalPipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import { BuySellService } from '../../services/buy-sell.service';
import {FormsModule} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import {Holding} from '../../models/portfolio.model'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  imports: [
    NgForOf,
    NgIf,
    NavbarComponent,
    DecimalPipe,
    FormsModule,
    MatTooltipModule,
    NgClass
  ],
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  holdings: Holding[] = [];

  searchText: string = '';

  dropdownOpen = false;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private portfolioService: PortfolioService,
    private buySellService :BuySellService
  ) {}

  ngOnInit(): void {
    console.log('PortfolioComponent initialized');


    this.portfolioService.getHoldings().subscribe({
      next: (data) => {
        console.log('Holdings fetched:', data);
        this.holdings = data;
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });
  }

  get portfolioValue(): number {
    return this.holdings.reduce((sum, h) => sum + h.currentValue, 0);
  }

  get portfolioGain(): number {
    return this.holdings.reduce(
      (gain, h) => gain + (h.currentPrice - h.avgBuyPrice) * h.quantity,
      0
    );
  }

  get portfolioGainPercent(): number {
    const totalInvestment = this.holdings.reduce(
      (sum, h) => sum + h.avgBuyPrice * h.quantity,
      0
    );
    return totalInvestment ? (this.portfolioGain / totalInvestment) * 100 : 0;
  }

  getProfitLoss(holding: Holding): number {
    return (holding.currentPrice - holding.avgBuyPrice) * holding.quantity;
  }

  getProfitLossPercent(holding: any): number {
    const { avgBuyPrice, currentPrice } = holding;
    if (!avgBuyPrice) return 0;
    return ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100;
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  clearSort() {
    this.sortColumn = '';
    this.sortDirection = 'asc';
  }

  get filteredHoldings(): Holding[] {
    const query = this.searchText.trim().toLowerCase();

    let filtered = this.holdings.filter(h =>
      h.stockName.toLowerCase().includes(query)
    );

    // Sorting logic
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        let aValue = 0, bValue = 0;

        if (this.sortColumn === 'pl') {
          aValue = this.getProfitLoss(a);
          bValue = this.getProfitLoss(b);
        } else if (this.sortColumn === 'value') {
          aValue = a.currentValue;
          bValue = b.currentValue;
        }

        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  onBuy(holding: any) {
    this.closeDropdown();
    // your buy logic here
  }

  onSell(holding: any) {
    this.closeDropdown();
    // your sell logic here
  }



}
