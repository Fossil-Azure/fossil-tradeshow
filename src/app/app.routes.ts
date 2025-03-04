import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '../shared/Interceptor/auth.guard';
import { CartPageComponent } from './cart-page/cart-page.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'welcome', component: WelcomeComponent},
  {
    path: 'tradeshow',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'order-confirmation', component: OrderConfirmationComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      {path: 'user-profile', component: UserProfileComponent}
    ],
    canActivate: [AuthGuard],
  },
  // Redirect any unknown paths
  { path: '**', redirectTo: 'login' },
];

export const AppRoutes = RouterModule.forRoot(routes);
