import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartserviceService {
  private cartCountSource = new BehaviorSubject<number>(0); // Initial cart count is 0
  cartCount$ = this.cartCountSource.asObservable(); // Observable for cart count updates

  // Update the cart count
  updateCartCount(count: number): void {
    this.cartCountSource.next(count);
  }

  // Get the current cart count value
  getCartCount(): number {
    return this.cartCountSource.getValue();
  }
}
