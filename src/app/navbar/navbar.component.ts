import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService:AuthService,private router:Router) {
  }
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  onLogout(){
    this.authService.logout().subscribe({
      next:()=>{
        this.router.navigate(['/login']);
      },
      error:(err)=>{
        console.error("Logout failed",err)
      }
    });
  }

}
