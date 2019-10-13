import { Store } from '@ngrx/store';
import { AuthService } from './../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as recipesActions from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) { }

  storeRecipes() {
    const recipies = this.recipeService.getRecipes();
    if (!recipies.length) {
      return;
    }
    this.http.put('https://shopping-and-recipe-angular.firebaseio.com/recipies.json', recipies)
    .subscribe(
      response => {
        console.log(response);
      }
    );
  }

  fetchRecipies() {
    return this.http
    .get<Recipe[]>(
      'https://shopping-and-recipe-angular.firebaseio.com/recipies.json'
      )
      .pipe(
        map( recipes => {
          return recipes.map( recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          });
        }),
        tap( recipes => {
          // this.recipeService.setRecipies(recipes);
          this.store.dispatch(new recipesActions.SetRecipes(recipes));
        })
      );
  }
}
