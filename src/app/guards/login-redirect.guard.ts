import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getCurrentUser().pipe(
      map(response => {
        const user = response.data;
        if (user) {
          // Redirect based on role
          if (user.role === 'ADMIN') {
            return this.router.createUrlTree(['/admin-dashboard']);
          } else {
            return this.router.createUrlTree(['/home']);
          }
        }
        // If no user is logged in, allow access to login
        return true;
      }),
      catchError(() => of(true)) // In case of error (like not logged in), allow access to login
    );
  }
}
