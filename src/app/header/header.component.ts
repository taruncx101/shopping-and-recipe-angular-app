import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSub: Subscription;
  @Output() featureSelected = new EventEmitter<string>();

  constructor(private datastorageService: DataStorageService,
              private authService: AuthService, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSub = this.store.select('auth')
    .pipe(
      map(authSate => {
        return authSate.user;
      })
    )
    .subscribe( user => {
      this.isAuthenticated = !!user;
    });
  }
  onSelect(feature: 'string') {
    this.featureSelected.emit(feature);
  }
  onSaveData() {
    // this.datastorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }
  onFetchData() {
    // this.datastorageService.fetchRecipies().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }
  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
