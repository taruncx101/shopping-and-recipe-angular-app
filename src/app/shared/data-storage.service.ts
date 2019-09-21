import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const recipies = this.recipeService.getRecipes();
    this.http.put('https://shopping-and-recipe-angular.firebaseio.com/recipies.json', recipies)
    .subscribe(
      response => {
        console.log(response);
      }
    );
  }

  fetchRecipies() {
    return this.http
    .get<Recipe[]>('https://shopping-and-recipe-angular.firebaseio.com/recipies.json')
    .pipe(
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
