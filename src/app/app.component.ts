import { Store } from '@ngrx/store';
import { LoggingService } from './logging-service';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopping-and-recipe-angular-app';

  loadedFeature = 'recipe';
  constructor(private authService: AuthService,
              private loggingService: LoggingService,
              private store: Store<fromApp.AppState>) {}
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
  ngOnInit() {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
    this.loggingService.printLog('Hello from app component ngOnInit');
  }
}
