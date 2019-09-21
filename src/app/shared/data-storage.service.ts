import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    this.http.get<Recipe[]>('https://shopping-and-recipe-angular.firebaseio.com/recipies.json')
    .subscribe( recipes => {
      this.recipeService.setRecipies(recipes);
      console.log(recipes);
    });
  }
}
