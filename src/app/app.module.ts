import { CoreModule } from './core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ShoppingListReducer } from './shopping-list/store/shopping-list.reducer';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({shoppingList: ShoppingListReducer}),
    SharedModule,
    CoreModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
