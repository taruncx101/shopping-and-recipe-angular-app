import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';

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
}
