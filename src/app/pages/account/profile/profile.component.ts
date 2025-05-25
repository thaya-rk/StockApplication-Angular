import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.services';
import {DecimalPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    NgIf,
    FormsModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  error: string = '';

  isDarkTheme: boolean = false;
  notificationsOn: boolean = true;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.accountService.getProfile().subscribe({
      next: res => this.user = res,
      error: () => this.error = 'Failed to load profile'
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

}
