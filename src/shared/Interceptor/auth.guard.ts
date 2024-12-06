import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiCallingService } from '../API/api-calling.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private api: ApiCallingService, private router: Router) { }

    canActivate(): boolean {
        if (this.api.isLoggedIn()) {
            return true; // Token is valid, grant access
        } else {
            this.api.logout(); // Clear expired token
            this.router.navigate(['/login']); // Redirect to login
            return false;
        }
    }
}
