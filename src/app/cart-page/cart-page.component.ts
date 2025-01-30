import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartserviceService } from '../../shared/CartService/cartservice.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
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
    AUD: 'A$'
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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private api: ApiCallingService,
    private loader: LoaderServiceService, private snackBar: MatSnackBar, private cartService: CartserviceService,
    private dialog: MatDialog) {
    // Observe screen size changes using BreakpointObserver
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
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
    this.loader.show()
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
            quantity: item.quantity
          }));
        }
        this.loader.hide()
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.loader.hide()
      }
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


  updateSubtotal(item: any): void {
    item.subtotal = item.price * item.quantity;
  }

  removeItem(item: any): void {
    const emailId = this.userInfo.emailId;
    const sku = item.sku;
    const currentCount = this.cartService.getCartCount();
    this.confirmationMessage = `Are you sure you want to remove "${item.name}" from your cart?`
    const dialogRef = this.dialog.open(this.confirmDialog, {
      id: 'confirm-dialog',
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeItem(emailId, sku).subscribe({
          next: () => {
            this.cartItems = this.cartItems.filter((cartItem: { sku: any; }) => cartItem.sku !== sku);
            const updatedCount = currentCount - 1;
            this.cartService.updateCartCount(updatedCount)
            this.snackBar.open(`"${item.name}" has been removed from your cart.`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error removing item from cart:', error);
            this.snackBar.open('An error occurred while trying to remove the item.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
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
    const dialogRef = this.dialog.open(this.placeOrder, {
      id: 'place-order-dialog',
      width: "500px"
    });
  }

  validateQuantity(item: any): void {
    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1; // Reset invalid input
    }
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

  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) {
      this.snackBar.open('Quantity cannot be less than 1.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.api.updateCartItemQuantity(this.userInfo.emailId, item.sku, newQuantity).subscribe({
      next: (response) => {
        // Update the local cart item quantity
        item.quantity = newQuantity;
        this.snackBar.open(`Quantity updated to ${newQuantity} for SKU ${item.sku}.`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.snackBar.open('Failed to update quantity.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
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

  confirmOrder(): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('confirm-dialog')?.close();
    const order = {
      emailId: this.userInfo.emailId,
      items: this.items.items,
      totalAmount: this.totalPrice
    };

    this.api.placeOrder(order, false).subscribe({
      next: (response) => {
        this.cartItems = [];
        this.cartService.updateCartCount(0)
        console.log("Order placed successfully:", response);
        this.snackBar.open(`Order placed successfully`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        if (error.status === 409) {
          this.duplicateOrder = `Some items in your cart were already ordered. Do you want to continue?`;
          const dialogRef = this.dialog.open(this.duplicateDialog, {
            id: 'duplicate-dialog'
          });

          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
              this.api.placeOrder(order, true).subscribe({
                next: (confirmedResponse) => {
                  console.log("Order confirmed successfully:", confirmedResponse);
                  this.snackBar.open(`Order placed successfully`, 'Close', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                  });
                  this.dialog.closeAll();
                  this.dialog.getDialogById('confirm-dialog')?.close();
                  this.cartItems = [];
                  this.cartService.updateCartCount(0)
                },
                error: (confirmError) => {
                  console.error("Error confirming order:", confirmError);
                }
              });
            }
          });
        } else {
          console.error("Error placing order:", error);
        }
      }
    });
  }
}
