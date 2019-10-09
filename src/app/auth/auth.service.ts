import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) { }


  setLogouTimer(expireationDuration: number) {
    console.log({expireationDuration});
    this.tokenExpirationTimer = setTimeout(
      () => {
        // this.logout();
        this.store.dispatch(new AuthActions.Logout());
      }, expireationDuration);
  }

  clearLogOutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }



}
