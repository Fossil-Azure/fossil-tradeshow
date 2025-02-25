import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiCallingService } from '../API/api-calling.service';

@Injectable({
  providedIn: 'root'
})
export class CartserviceService {
  private cartCountSource = new BehaviorSubject<number>(0); // Initial cart count is 0
  cartCount$ = this.cartCountSource.asObservable(); // Observable for cart count updates
  userInfo: any;

  // Update the cart count
  updateCartCount(count: number): void {
    this.cartCountSource.next(count);
  }

  // Get the current cart count value
  getCartCount(): number {
    return this.cartCountSource.getValue();
  }

  constructor(private api: ApiCallingService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.fetchCart();
    } else {
      this.userInfo = null;
      api.logout();
    }
  }

  // Fetch cart items from backend
  fetchCart() {
    console.log("Fetching Cart..")
    this.api.getCart(this.userInfo.emailId).subscribe({
      next: (response) => {
        if(response) {
          this.cartCountSource.next(response.items.length);
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      },
    });
  }
}
