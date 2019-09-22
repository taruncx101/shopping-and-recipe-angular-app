import { AuthService } from './../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

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
    return this.authService.user
    .pipe(take(1),
      exhaustMap(
        user => {
          return this.http
          .get<Recipe[]>(
            'https://shopping-and-recipe-angular.firebaseio.com/recipies.json',
            {
              params: new HttpParams().set('auth', user.token)
            }
            );
      }),
      map( recipes => {
        return recipes.map( recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap( recipes => {
        this.recipeService.setRecipies(recipes);
      })
     )
    ;
  }
}
