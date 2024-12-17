import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiCallingService {

  // private baseUrl = "http://localhost:8080";
  private baseUrl = environment.apiUrl;

  private loginUrl = `${this.baseUrl}/api/auth/login`;

  constructor(private http: HttpClient, private router: Router) { }

  // Send login credentials to the backend
  login(emailId: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { emailId, password });
  }

  // Save the token in localStorage or sessionStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();

    if (token) {
      try {
        const decoded: any = jwtDecode(token); // Decode the JWT
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        // Check if the token is expired
        return decoded.exp > currentTime;
      } catch (error) {
        console.error('Error decoding token:', error);
        return false; // If decoding fails, consider the token invalid
      }
    }

    return false; // No token found
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
