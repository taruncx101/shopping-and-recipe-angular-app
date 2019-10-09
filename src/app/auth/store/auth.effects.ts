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

const handleAuthentication = (resData: AuthResponseData) => {
  const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  return new AuthActions.AuthenticateSuccess({
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationdate: expirationDate
   })
  ;
};

const handleError = (errorRes) => {
  let errorMsg = 'An unknown error occured.';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMsg));
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
  return of(new AuthActions.AuthenticateFail(errorMsg));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseApiKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      )
      .pipe(
        map( resData => {
          return handleAuthentication(resData);
        }),
        catchError( errorRes => {
          return handleError(errorRes);
        }),
      );
    })
  );

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
          return handleAuthentication(resData);
        }),
        catchError( errorRes => {
          return handleError(errorRes);
        }),

      );
    }),
  );

  @Effect({
    dispatch: false
  })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/']);
    })
  );
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
