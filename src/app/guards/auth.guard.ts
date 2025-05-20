import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getCurrentUser().pipe(
      map(response => {
        const user = response.data;
        console.log("Inside authguard:", user?.role);

        if (state.url === '/admin-dashboard') {
          if (user && user.role === 'ADMIN') {
            return true;
          }
          return this.router.createUrlTree(['/home']);
        }

        if (user) return true;

        return this.router.createUrlTree(['/home']);
      }),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }

}
