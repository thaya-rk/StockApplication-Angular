import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './pages/register/register.component';
import {AuthGuard} from './guards/auth.guard';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import {PortfolioComponent} from './pages/portfolio/portfolio.component';
import {AccountComponent} from './pages/account/account.component';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {HoldingsComponent} from './pages/holdings/holdings.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent ,canActivate: [AuthGuard] },
  {path: 'admin-dashboard', component: AdminDashboardComponent,canActivate: [AuthGuard]},
  {path:'holding',component:HoldingsComponent},

  //fallback Route,will work if no route available
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
