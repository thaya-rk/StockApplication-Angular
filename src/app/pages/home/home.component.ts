import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NavbarComponent} from '../../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private authService :AuthService,private router:Router) {}
  username = localStorage.getItem('username') || '';
  welcomeMessage = 'Welcome to Forex Application';
}

