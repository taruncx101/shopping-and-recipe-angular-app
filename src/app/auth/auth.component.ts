import { Store } from '@ngrx/store';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: true}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(
      authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if (this.error) {
          this.showErrorAlert(this.error);
        }
      }
    );
  }
  onCloseAlert() {
    // this.error = null;
    this.store.dispatch(new authActions.ClearError());
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;


    this.isLoading = true;

    if (this.isLoginMode) {
      this.store.dispatch(new authActions.LoginStart({email, password}));
    } else {
      this.store.dispatch(new authActions.SignupStart({email, password}));
    }
    form.reset();
  }
  showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostContainerRef = this.alertHost.viewContainerRef;
    hostContainerRef.clear();

    const componentRef = hostContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.closeEvent.subscribe( () => {
      this.closeSub.unsubscribe();
      hostContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
