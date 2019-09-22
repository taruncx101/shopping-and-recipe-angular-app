import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{

  isAuthenticated = false;
  private userSub: Subscription;
  @Output() featureSelected = new EventEmitter<string>();

  constructor(private datastorageService: DataStorageService,
              private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    });
  }
  onSelect(feature: 'string') {
    this.featureSelected.emit(feature);
  }
  onSaveData() {
    this.datastorageService.storeRecipes();
  }
  onFetchData() {
    this.datastorageService.fetchRecipies().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
