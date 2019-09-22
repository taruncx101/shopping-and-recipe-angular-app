import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopping-and-recipe-angular-app';

  loadedFeature = 'recipe';
  constructor(private authService: AuthService) {}
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
  ngOnInit() {
    this.authService.autoLogin();
  }
}
