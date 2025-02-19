import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartserviceService } from '../../shared/CartService/cartservice.service';
import { MatDialog } from '@angular/material/dialog';
import { response } from 'express';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  isMobile: boolean = false;
  userRating: number = 0;
  hoveredRating!: number;
  userInfo: any;
  userCurrency: any;
  cart: any;
  currencySymbolMap: { [key: string]: string } = {
    USD: '$',
    INR: '₹',
    SGD: 'S$',
    HKD: 'HK$',
    JPY: '¥',
    AUD: 'A$',
  };
  cartItems: any[] = [];
  confirmationMessage: any;
  items: any;
  duplicateOrder: any;

  @ViewChild('confirmDialog')
  confirmDialog!: TemplateRef<any>;

  @ViewChild('placeOrder')
  placeOrder!: TemplateRef<any>;

  @ViewChild('duplicateDialog')
  duplicateDialog!: TemplateRef<any>;
  isLoading: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private api: ApiCallingService,
    private loader: LoaderServiceService,
    private snackBar: MatSnackBar,
    private cartService: CartserviceService,
    private dialog: MatDialog
  ) {
    // Observe screen size changes using BreakpointObserver
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.userCurrency = this.userInfo.currency;
      this.fetchCart();
    } else {
      this.userInfo = null;
      api.logout();
    }
  }

  fetchCart(): void {
    this.isLoading = true;
    this.api.getCart(this.userInfo.emailId).subscribe({
      next: (response) => {
        if (response) {
          this.items = response;
          this.cartItems = response.items.map((item: any) => ({
            image: item.product.imageUrl,
            name: item.product.productTitle,
            sku: item.product.sku,
            brand: item.product.brand,
            price: this.getProductPrice(item.product),
            quantity: item.quantity,
          }));
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.isLoading = false;
      },
    });
  }

  getProductPrice(product: any): number {
    switch (this.userCurrency) {
      case 'USD':
        return product.mrpUsd;
      case 'INR':
        return product.mrpInr;
      case 'SGD':
        return product.mrpSgd;
      case 'HKD':
        return product.mrpHkd;
      case 'JPY':
        return product.mrpJpy;
      case 'AUD':
        return product.mrpAud;
      default:
        return product.mrpUsd; // Default to USD
    }
  }

  get currencySymbol(): string {
    return this.currencySymbolMap[this.userCurrency] || '$';
  }

  get totalItems(): number {
    if (!this.cartItems || this.cartItems.length === 0) {
      return 0;
    }

    return this.cartItems.reduce((sum: number, item: any) => {
      const quantity = item.quantity || 0;
      return sum + quantity;
    }, 0);
  }

  updateSubtotal(item: any): void {
    item.subtotal = item.price * item.quantity;
  }

  removeItem(item: any): void {
    const emailId = this.userInfo.emailId;
    const sku = item.sku;
    const currentCount = this.cartService.getCartCount();
    this.confirmationMessage = `Are you sure you want to remove "${item.name}" from your cart?`;
    const dialogRef = this.dialog.open(this.confirmDialog, {
      id: 'confirm-dialog',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.api.removeItem(emailId, sku).subscribe({
          next: () => {
            this.cartItems = this.cartItems.filter(
              (cartItem: { sku: any }) => cartItem.sku !== sku
            );
            const updatedCount = currentCount - 1;
            this.cartService.updateCartCount(updatedCount);
            this.isLoading = false;
            this.snackBar.open(
              `"${item.name}" has been removed from your cart.`,
              'Close',
              {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: ['success-snackbar'],
              }
            );
          },
          error: (error) => {
            console.error('Error removing item from cart:', error);
            this.isLoading = false;
            this.snackBar.open(
              'An error occurred while trying to remove the item.',
              'Close',
              {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: ['error-snackbar'],
              }
            );
          },
        });
      }
    });
  }

  closeDialog(confirmed: boolean): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('confirm-dialog')?.close(confirmed);
  }

  closeOrderDialog(confirmed: boolean): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('duplicate-dialog')?.close(confirmed);
  }

  proceedToCheckout(): void {
    this.api.getCart(this.userInfo.emailId).subscribe({
      next: (response) => {
        this.items = response;
      },
      error: (err) => {
        console.log(err)
      }
    })
    const dialogRef = this.dialog.open(this.placeOrder, {
      id: 'place-order-dialog',
      width: '500px',
    });
  }

  validateQuantity(item: any): void {
    const value = parseInt(item.quantity, 10);

    if (!value || value < 1) {
      item.quantity = 1;
    } else {
      item.quantity = value;
    }

    this.updateQuantity(item, item.quantity);
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

  navigateToShop() {
    this.router.navigate(['/tradeshow/home']);
  }

  get totalPrice(): number {
    if (!this.cartItems || this.cartItems.length === 0) {
      return 0;
    }

    const total = this.cartItems.reduce((sum: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);

    return parseFloat(total.toFixed(2));
  }

  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) {
      this.snackBar.open('Quantity cannot be less than 1.', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
      });
      return;
    }
    this.isLoading = true;
    this.api
      .updateCartItemQuantity(this.userInfo.emailId, item.sku, newQuantity)
      .subscribe({
        next: (response) => {
          // Update the local cart item quantity
          item.quantity = newQuantity;
          this.isLoading = false;
          this.snackBar.open(
            `Quantity updated to ${newQuantity} for SKU ${item.sku}.`,
            'Close',
            {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: ['success-snackbar'],
            }
          );
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to update quantity.', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  increaseQuantity(item: any): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  closePopUp() {
    this.dialog.closeAll();
    this.dialog.getDialogById('confirm-dialog')?.close();
  }

  createOrderPayload(): void {
    const totalUsd = this.items.items.reduce(
      (sum: number, item: { product: { mrpUsd: number }; quantity: number }) =>
        sum + item.product.mrpUsd * item.quantity,
      0
    );
    const totalInr = this.items.items.reduce(
      (sum: number, item: { product: { mrpInr: number }; quantity: number }) =>
        sum + item.product.mrpInr * item.quantity,
      0
    );
    const totalSgd = this.items.items.reduce(
      (sum: number, item: { product: { mrpSgd: number }; quantity: number }) =>
        sum + item.product.mrpSgd * item.quantity,
      0
    );
    const totalHkd = this.items.items.reduce(
      (sum: number, item: { product: { mrpHkd: number }; quantity: number }) =>
        sum + item.product.mrpHkd * item.quantity,
      0
    );
    const totalJpy = this.items.items.reduce(
      (sum: number, item: { product: { mrpJpy: number }; quantity: number }) =>
        sum + item.product.mrpJpy * item.quantity,
      0
    );
    const totalAud = this.items.items.reduce(
      (sum: number, item: { product: { mrpAud: number }; quantity: number }) =>
        sum + item.product.mrpAud * item.quantity,
      0
    );

    const order = {
      emailId: this.userInfo.emailId,
      items: this.items.items,
      totalUsd: totalUsd.toFixed(2),
      totalInr: totalInr.toFixed(2),
      totalSgd: totalSgd.toFixed(2),
      totalHkd: totalHkd.toFixed(2),
      totalJpy: totalJpy.toFixed(2),
      totalAud: totalAud.toFixed(2),
    };
  }

  confirmOrder(): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('confirm-dialog')?.close();
    // Calculate total prices for each currency
    const totalUsd = this.items.items.reduce(
      (sum: any, item: any) => sum + item.product.mrpUsd * item.quantity,
      0
    );
    const totalInr = this.items.items.reduce(
      (sum: any, item: any) => sum + item.product.mrpInr * item.quantity,
      0
    );
    const totalSgd = this.items.items.reduce(
      (sum: any, item: any) => sum + item.product.mrpSgd * item.quantity,
      0
    );
    const totalHkd = this.items.items.reduce(
      (sum: any, item: any) => sum + item.product.mrpHkd * item.quantity,
      0
    );
    const totalJpy = this.items.items.reduce(
      (sum: any, item: any) => sum + item.product.mrpJpy * item.quantity,
      0
    );
    const totalAud = this.items.items.reduce(
      (sum: any, item: any) => sum + item.product.mrpAud * item.quantity,
      0
    );

    const order = {
      emailId: this.userInfo.emailId,
      items: this.items.items,
      totalUsd: totalUsd.toFixed(2),
      totalInr: totalInr.toFixed(2),
      totalSgd: totalSgd.toFixed(2),
      totalHkd: totalHkd.toFixed(2),
      totalJpy: totalJpy.toFixed(2),
      totalAud: totalAud.toFixed(2),
    };

    this.isLoading = true;

    this.api.placeOrder(order, false).subscribe({
      next: (response) => {
        this.cartItems = [];
        this.cartService.updateCartCount(0);
        this.isLoading = false;
        this.snackBar.open(`Order placed successfully`, 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
        });

        // Redirect to order-confirmation page with order details
        this.router.navigate(['tradeshow/order-confirmation'], {
          state: { orderDetails: response },
        });
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.duplicateOrder = `Some items in your cart were already ordered. Do you want to continue?`;
          const dialogRef = this.dialog.open(this.duplicateDialog, {
            id: 'duplicate-dialog',
          });

          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
              this.isLoading = true;
              this.api.placeOrder(order, true).subscribe({
                next: (confirmedResponse) => {
                  this.isLoading = false;
                  this.snackBar.open(`Order placed successfully`, 'Close', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    panelClass: ['success-snackbar'],
                  });
                  this.dialog.closeAll();
                  this.dialog.getDialogById('confirm-dialog')?.close();
                  this.cartItems = [];
                  this.cartService.updateCartCount(0);
                  // Redirect to order-confirmation page with order details
                  this.router.navigate(['tradeshow/order-confirmation'], {
                    state: { orderDetails: confirmedResponse },
                  });
                },
                error: (confirmError) => {
                  this.isLoading = false;
                  console.error('Error confirming order:', confirmError);
                },
              });
            }
          });
        } else {
          this.isLoading = false;
          console.error('Error placing order:', error);
        }
      },
    });
  }
}
