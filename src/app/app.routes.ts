import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '../shared/Interceptor/auth.guard';
import { CartPageComponent } from './cart-page/cart-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'tradeshow',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'cart', component: CartPageComponent },
    ],
    canActivate: [AuthGuard]
  },
  // Redirect any unknown paths
  { path: '**', redirectTo: 'login' }
];

export const AppRoutes = RouterModule.forRoot(routes);
