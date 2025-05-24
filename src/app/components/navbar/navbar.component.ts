import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgStyle,
    NgForOf,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navItems = [
    { label: 'Home', link: '/home', icon: 'fas fa-home' },
    { label: 'Watchlist', link: '/watchlist', icon: 'fas fa-eye' },
    { label: 'Portfolio', link: '/portfolio', icon: 'fas fa-briefcase' },
    { label: 'Holding', link: '/holding', icon: 'fas fa-chart-line' },
    { label: 'Account', link: '/account', icon: 'fas fa-user' },
  ];



  constructor(private authService: AuthService, private router: Router) {
  }

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  showLogoutModal = false;
  closingLogout = false;

  onLogout() {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      this.authService.logout().subscribe({
        next: () => {
          localStorage.removeItem('jwtToken');
          console.log('Logout success, navigating to login...');

          // Reset Angular route state and force navigation
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err: any) => {
          console.error("Logout failed", err);
        }
      });
    }
  }


  openLogoutModal() {
    this.showLogoutModal = true;
    this.closingLogout = false;
  }

  closeLogoutModal() {
    this.closingLogout = true;
    setTimeout(() => {
      this.showLogoutModal = false;
      this.closingLogout = false;
    }, 300); // matches CSS animation
  }

  confirmLogout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('jwtToken');
        console.log('Logout success, navigating to login...');
        this.closeLogoutModal();

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        console.error("Logout failed", err);
      }
    });
  }


}
