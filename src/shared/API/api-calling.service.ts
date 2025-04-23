import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiCallingService {
  private baseUrl = 'http://localhost:8080';
  // private baseUrl = environment.apiUrl;

  private loginUrl = `${this.baseUrl}/api/auth/login`;
  private findProduct = `${this.baseUrl}/searchUniqueProduct`;
  private cart = `${this.baseUrl}/cart`;
  private order = `${this.baseUrl}/orders`;
  private pass = `${this.baseUrl}/update-password`;
  private rating = `${this.baseUrl}/product-rating`;

  constructor(private http: HttpClient, private router: Router) {}

  // Send login credentials to the backend
  login(emailId: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { emailId, password });
  }

  // Save the token in localStorage or sessionStorage
  saveToken(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
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
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getProduct(searchValue: string): Observable<any> {
    return this.http.post(this.findProduct, { searchValue });
  }

  addToCart(
    emailId: string,
    product: any,
    quantity: number,
    confirmAddition: boolean
  ): Observable<any> {
    const requestBody = {
      product,
      quantity,
      confirmAddition,
    };
    return this.http.post(`${this.cart}/${emailId}/add`, requestBody);
  }

  bulkAddToCart(
    emailId: string,
    cartItems: any,
    confirmAddition: boolean = false
  ): Observable<any> {
    return this.http.post(
      `${this.cart}/${emailId}/add-bulk?confirmAddition=${confirmAddition}`,
      cartItems
    );
  }

  getCart(emailId: string): Observable<any> {
    return this.http.get(`${this.cart}/${emailId}`);
  }

  removeItem(emailId: string, sku: string): Observable<void> {
    return this.http.delete<void>(`${this.cart}/${emailId}/item/${sku}`);
  }

  updateCartItemQuantity(
    emailId: string,
    sku: string,
    quantity: number
  ): Observable<any> {
    return this.http.put(
      `${this.cart}/${emailId}/item/${sku}/quantity/${quantity}`,
      {}
    );
  }

  getUsersOrders(emailId: string): Observable<any> {
    return this.http.get(`${this.order}/user/${emailId}`);
  }

  placeOrder(order: any, confirm: boolean): Observable<any> {
    return this.http.post(`${this.order}/place?confirm=${confirm}`, order);
  }

  updateOrder(order: any, changes: any): Observable<any> {
    return this.http.put(`${this.order}/update/${order.id}`, order, changes);
  }

  updatePassword(emailId: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.pass}?email=${emailId}&newPassword=${newPassword}`,
      {}
    );
  }

  saveOrUpdateRating(ratingPayload: any): Observable<any> {
    return this.http.post(`${this.rating}`, ratingPayload);
  }

  getAvgRating(skucode: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/avg-rating/${skucode}`);
  }

  getUserDetails(emailId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUser/${emailId}`);
  }
}
