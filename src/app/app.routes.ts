import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
];

export const AppRoutes = RouterModule.forRoot(routes);
