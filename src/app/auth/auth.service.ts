import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  kind: string;
  idToken:	string; // A Firebase Auth ID token for the newly created user.
  email:	string; // The email for the newly created user.
  refreshToken:	string; // A Firebase Auth refresh token for the newly created user.
  expiresIn:	string; // The number of seconds in which the ID token expires.
  localId:	string; // The uid of the newly created user.
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
    );
  }
}
