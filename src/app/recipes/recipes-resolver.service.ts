import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      this.store.dispatch(new RecipeActions.FetchRecipes());
      return this.actions$.pipe(
        ofType(RecipeActions.SET_RECIPES),
        take(1)
      );
      // return this.dataStorageService.fetchRecipies();
  }
}
