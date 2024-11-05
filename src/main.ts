import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { LoginPageComponent } from './app/login-page/login-page.component';
import { provideRouter } from '@angular/router';

const routes = [
  { path: '', component: LoginPageComponent }, // Default route
];


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
