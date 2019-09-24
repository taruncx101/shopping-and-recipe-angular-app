import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging-service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private igChaangeSub: Subscription;
  ingredients: Ingredient[];
  constructor(private slService: ShoppingListService, private loggingService: LoggingService) { }

  ngOnInit() {
    this.loggingService.printLog('Hello from shopping-list component ngOnInit');
    this.ingredients = this.slService.getIngredients();
    this.igChaangeSub = this.slService.ingredientChanged
    .subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(index: number) {
    // console.log({index})
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.igChaangeSub.unsubscribe();
  }

}
