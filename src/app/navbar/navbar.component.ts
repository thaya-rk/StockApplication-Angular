import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {
  }

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }


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


}
