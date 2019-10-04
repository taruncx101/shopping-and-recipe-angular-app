import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



export interface AuthResponseData {
  kind: string;
  idToken:	string; // A Firebase Auth ID token for the newly created user.
  email:	string; // The email for the newly created user.
  refreshToken:	string; // A Firebase Auth refresh token for the newly created user.
  expiresIn:	string; // The number of seconds in which the ID token expires.
  localId:	string; // The uid of the newly created user.
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseApiKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
      .pipe(
        map( resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationdate: expirationDate
           })
          ;
        }),
        catchError( errorRes => {
          let errorMsg = 'An unknown error occured.';
          if (!errorRes.error || !errorRes.error.error) {
            return of(new AuthActions.LoginFail(errorMsg));
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMsg = 'This email already exist.';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMsg = 'This email address not found.';
              break;
            case 'INVALID_PASSWORD':
              errorMsg = 'This passworrd is not correct.';
              break;
            case 'USER_DISABLED':
              errorMsg = 'The user account has been disabled by an administrator.';
              break;
          }
          return of(new AuthActions.LoginFail(errorMsg));
        }),

      );
    }),
  );

  @Effect({
    dispatch: false
  })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
