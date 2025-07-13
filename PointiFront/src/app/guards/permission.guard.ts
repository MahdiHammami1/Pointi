import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../features/auth/auth.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  const requiredPermission = route.data['permission'];

  return this.authService.fetchCurrentUserFromApi().pipe(
    map(user => {
      const permissions = user?.role?.permissions?.map((p: any) => p.nom) || [];
      if (!permissions.includes(requiredPermission)) {
        this.router.navigate(['/loggedin/unauthorized']);
        return false;
      }
      return true;
    }),
    catchError(err => {
      this.router.navigate(['/unauthorized']);
      return of(false);
    })
  );
}
}
