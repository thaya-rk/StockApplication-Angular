import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './pages/register/register.component';
import {AuthGuard} from './guards/auth.guard';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import {PortfolioComponent} from './pages/portfolio/portfolio.component';
import {AccountComponent} from './pages/account/account.component';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {HoldingsComponent} from './pages/holdings/holdings.component';
import {LedgerComponent} from './pages/account/ledger/ledger.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {FundsComponent} from './pages/account/funds/funds.component';
import {ProfileComponent} from './pages/account/profile/profile.component';
import {SupportComponent} from './pages/support/support.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import {PaymentComponent} from './components/payment/payment.component';
import {PaymentStatusComponent} from './pages/payment-status/payment-status.component';



export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginRedirectGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginRedirectGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'funds', pathMatch: 'full' },
      { path: 'funds', component: FundsComponent },
      { path: 'transactions', component: LedgerComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: 'support', component: SupportComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  {path:'holding',component:HoldingsComponent},

  { path: 'payment', component: PaymentComponent,canActivate:[AuthGuard] },
  {path:'payment-status',component:PaymentStatusComponent,canActivate:[AuthGuard]}
];
