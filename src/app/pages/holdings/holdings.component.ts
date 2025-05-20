import { Component } from '@angular/core';
import {NavbarComponent} from '../../navbar/navbar.component';
import {HoldingsServices} from '../../services/holdings.services';
import {Holding} from '../../services/portfolio.services';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-holdings',
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css'
})
export class HoldingsComponent {

  holdings: Holding[] = [];
  userId: number = 2;

  constructor(
    private holdingService:HoldingsServices) {
  }
  ngOnInit(): void {
    console.log('HoldingsComponent initialized');


    this.holdingService.getHoldings().subscribe({
      next: (data) => {
        console.log('Holdings fetched:', data);
        this.holdings = data;
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });
  }

}
