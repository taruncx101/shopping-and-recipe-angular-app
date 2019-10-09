import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken:	string; // A Firebase Auth ID token for the newly created user.
  email:	string; // The email for the newly created user.
  refreshToken:	string; // A Firebase Auth refresh token for the newly created user.
  expiresIn:	string; // The number of seconds in which the ID token expires.
  localId:	string; // The uid of the newly created user.
  registered?: boolean;
}

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
