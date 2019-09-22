import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC6yMGdfpkuKumGo5xTVEAVSInHB75m36w',
      {
        email,
        password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError)
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC6yMGdfpkuKumGo5xTVEAVSInHB75m36w',
      {
        email,
        password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An unknown error occured.';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
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
    return throwError(errorMsg);
  }
}
