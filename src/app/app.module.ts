// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { LoginPageComponent } from './login-page/login-page.component'; // non-standalone login component
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutComponent } from './layout/layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiCallingService } from '../shared/API/api-calling.service';
import { CartPageComponent } from './cart-page/cart-page.component';
import { LoaderComponent } from './loader/loader.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtInterceptor } from '../shared/Interceptor/jwt.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

export function checkToken(authService: ApiCallingService): () => void {
  return () => {
    const token = authService.getToken();
    if (token && !authService.isLoggedIn()) {
      authService.logout();
    }
  };
}

@NgModule({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: checkToken,
      deps: [ApiCallingService],
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  declarations: [
    LoginPageComponent,
    HomePageComponent,
    LayoutComponent,
    CartPageComponent,
    LoaderComponent,
    OrderConfirmationComponent,
    MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    ZXingScannerModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBadgeModule
  ],
  exports: [
    LoginPageComponent,
    HomePageComponent,
    LayoutComponent,
    CartPageComponent,
    LoaderComponent,
    OrderConfirmationComponent,
    MyOrdersComponent
  ]
})
export class AppModule { }
