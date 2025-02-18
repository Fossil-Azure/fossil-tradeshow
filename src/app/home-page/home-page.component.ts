import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartserviceService } from '../../shared/CartService/cartservice.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  @ViewChild('confirmDialog')
  confirmDialog!: TemplateRef<any>;

  skuCode!: string;
  showScanner: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | null = null;
  productName: string = '';
  productDescription: string = '';
  productCategory: string = '';
  productPrice: number = 0;
  productQuantity: number = 1;
  stars: number[] = [1, 2, 3, 4, 5];
  userRating: number = 0;
  msrp = 0;
  quantity: any = 1;
  subTotal = 0;
  hoveredRating = 0;
  isMobile = false;
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128];
  showProductCard = false;
  notFound = false;
  skuControl = new FormControl('');
  productDetails: any;
  userInfo: any;
  userCurrency: any;
  confirmationMessage: any;
  badgeCount: any;
  isLoading: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private api: ApiCallingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cartService: CartserviceService
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
    } else {
      this.userInfo = null;
      api.logout();
    }
  }

  get currencySymbol(): string {
    switch (this.userCurrency) {
      case 'USD':
        return '$'; // Dollar
      case 'INR':
        return '₹'; // Indian Rupee
      case 'SGD':
        return 'S$'; // Singapore Dollar
      case 'HKD':
        return 'HK$'; // Hong Kong Dollar
      case 'JPY':
        return '¥'; // Japanese Yen
      case 'AUD':
        return 'A$'; // Australian Dollar
      default:
        return '$'; // Default to USD
    }
  }

  get dynamicPrice(): number {
    return this.getProductPrice();
  }

  getProductPrice(): number {
    switch (this.userCurrency) {
      case 'USD':
        return this.productDetails.mrpUsd;
      case 'INR':
        return this.productDetails.mrpInr;
      case 'SGD':
        return this.productDetails.mrpSgd;
      case 'HKD':
        return this.productDetails.mrpHkd;
      case 'JPY':
        return this.productDetails.mrpJpy;
      case 'AUD':
        return this.productDetails.mrpAud;
      default:
        return this.productDetails.mrpUsd; // Default to USD
    }
  }

  // Opens the QR scanner modal
  openScanner() {
    this.showScanner = true;
  }

  // Closes the QR scanner modal
  closeScanner() {
    this.showScanner = false;
  }

  // Handle QR code result
  handleQrCodeResult(result: string) {
    this.skuCode = result.toUpperCase(); // Fill the input field with scanned text
    this.closeScanner();
  }

  // Select the first available camera
  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    if (devices && devices.length > 0) {
      this.selectedDevice = devices[0]; // Select the first camera
    }
  }

  // Clear the input field
  clearInput(): void {
    this.skuCode = '';
    this.notFound = false;
    this.showProductCard = false;
  }

  // Action to perform when text is entered or QR is scanned
  performAction(): void {
    this.isLoading = true;
    this.quantity = 1;
    if (this.skuControl.valid) {
      this.notFound = false;
      this.api.getProduct(this.skuCode.toUpperCase()).subscribe({
        next: (response) => {
          this.productDetails = response;
          const price = this.getProductPrice();
          this.subTotal = price * this.quantity;
          this.notFound = false;
          this.showProductCard = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
          this.notFound = true;
          this.showProductCard = false;
          this.isLoading = false;
        },
      });
    }
  }

  increment(): void {
    this.quantity++;
    const price = this.getProductPrice();
    this.subTotal = price * this.quantity;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
      const price = this.getProductPrice();
      this.subTotal = price * this.quantity;
    }
  }

  validateQuantity(): void {
    const value = parseInt(this.quantity, 10);

    if (!value || value < 1) {
      this.quantity = 1;
    } else {
      this.quantity = value;
    }
    const price = this.getProductPrice();
    this.subTotal = price * this.quantity;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
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

  addToCart() {
    if (this.userInfo == null) {
      this.api.logout();
    } else {
      const currentCount = this.cartService.getCartCount();
      this.api
        .addToCart(
          this.userInfo.emailId,
          this.productDetails,
          this.quantity,
          false
        )
        .subscribe({
          next: (response) => {
            if (!response.success) {
              const existingQuantity =
                response.cart.items.find(
                  (item: any) => item.product.sku === this.productDetails.sku
                )?.quantity || 0;

              this.confirmationMessage = `The product "${this.productDetails.sku}" already has a quantity of ${existingQuantity} in the cart. Do you want to add the selected quantity ${this.quantity} to this?`;
              const dialogRef = this.dialog.open(this.confirmDialog, {
                id: 'confirm-dialog',
              });

              dialogRef.afterClosed().subscribe((confirmed) => {
                if (confirmed) {
                  this.api
                    .addToCart(
                      this.userInfo.emailId,
                      this.productDetails,
                      this.quantity,
                      true
                    )
                    .subscribe({
                      next: (finalResponse) => {
                        this.showProductCard = false;
                        this.skuCode = '';
                        this.snackBar.open(finalResponse.message, 'Close', {
                          duration: 3000,
                          verticalPosition: 'bottom',
                          horizontalPosition: 'center',
                        });
                      },
                      error: (error) => {
                        console.error(
                          'Error adding to cart after confirmation:',
                          error
                        );
                        this.snackBar.open(
                          'Error adding item to the cart.',
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
                } else {
                  console.log('User canceled the addition.');
                }
              });
            } else {
              this.showProductCard = false;
              const updatedCount = currentCount + 1;
              this.cartService.updateCartCount(updatedCount);
              this.skuCode = '';
              this.snackBar.open(response.message, 'Close', {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: ['success-snackbar'],
              });
            }
          },
          error: (error) => {
            console.error('Error adding to cart:', error);
            this.snackBar.open(
              'An error occurred while adding the product.',
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
  }

  closeDialog(confirmed: boolean): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('confirm-dialog')?.close(confirmed);
  }
}
