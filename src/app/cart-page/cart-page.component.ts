import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  isMobile: boolean = false;
  userRating: number = 0;
  hoveredRating!: number;

  constructor(private breakpointObserver: BreakpointObserver) {
    // Observe screen size changes using BreakpointObserver
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  cartItems = [
    { sku: 'SKU12345', name: 'Machine Chronograph Smoke Stainless Steel Watch', brand: 'Fossil', price: 199.99, quantity: 3, image: 'assets/Watch.jpg', subtotal: 599.97 },
    { sku: 'SKU12346', name: 'Product Title 2', brand: 'Armani Exchange', price: 159.99, quantity: 1, image: 'assets/AX5722.jpg', subtotal: 159.99 },
    { sku: 'SKU12347', name: 'Product Title 3', brand: 'Fossil', price: 179.99, quantity: 1, image: 'assets/ES4081.jpg', subtotal: 179.99 },
    { sku: 'SKU12348', name: 'Product Title 4', brand: 'Michael Kors', price: 129.99, quantity: 7, image: 'assets/MK3898.jpg', subtotal: 909.93 },
    { sku: 'SKU12349', name: 'Product Title 5', brand: 'Skagen', price: 109.99, quantity: 1, image: 'assets/SKW2665.jpg', subtotal: 109.99 },
    { sku: 'SKU12350', name: 'Product Title 6', brand: 'Sketchers', price: 99.99, quantity: 14, image: 'assets/SR5144.JPG', subtotal: 1399.86 },
  ];

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return parseFloat(
      this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );
  }

  updateSubtotal(item: any): void {
    item.subtotal = item.price * item.quantity;
  }

  increaseQuantity(item: any): void {
    item.quantity++;
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) item.quantity--;
  }

  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
  }

  proceedToCheckout(): void {
    alert('Proceeding to checkout...');
  }

  updateQuantity(item: any): void {
    if (item.quantity < 1) {
      item.quantity = 1; // Reset to 1 if the user enters an invalid value
    }
    item.subtotal = item.quantity * item.price; // Update subtotal
  }

  validateQuantity(item: any): void {
    const value = parseInt(item.quantity, 10);

    if (!value || value < 1) {
      item.quantity = 1; // Reset to 1 if the input is invalid
    } else {
      item.quantity = value;
    }

    item.subtotal = item.quantity * item.price; // Update subtotal
  }

  rateProduct(star: number): void {
    this.userRating = star;
  }

  setRating(rating: number): void {
    this.userRating = rating; // Set the user's rating
  }

  hoverRating(rating: number): void {
    this.hoveredRating = rating; // Update the hovered rating
  }
}
