import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(take(1), map( authSate => {
       const isAuth = !!authSate.user;
       if (isAuth) {
         return true;
       }
       return this.router.createUrlTree(['/auth']);
      }
    ));
  }

}
