import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartserviceService } from '../../shared/CartService/cartservice.service';
import { response } from 'express';
import { error } from 'console';

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
  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_39,
    BarcodeFormat.DATA_MATRIX,
  ];
  showProductCard = false;
  notFound = false;
  skuControl = new FormControl('');
  productDetails: any;
  userInfo: any;
  userCurrency: any;
  confirmationMessage: any;
  badgeCount: any;
  isLoading: boolean = false;
  showSize: boolean = false;
  sizeQuantities: number[] = [];
  ratingPayload!: any;
  productRating: any = { averageRating: 0, ratings: [] };
  quantityError: boolean = false;
  isLoadingSection: boolean = false;

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

    this.cartService.fetchCart();

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
    this.skuCode = result.toUpperCase();
    this.performAction();
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
    this.userRating = 0;
    this.ratingPayload = null;
    this.productRating = null;
  }

  // Action to perform when text is entered or QR is scanned
  performAction(): void {
    this.isLoadingSection = true;
    this.quantity = 1;
    this.userRating = 0;
    this.ratingPayload = null;
    this.productRating = null;
    if (this.skuControl.valid) {
      this.notFound = false;
      this.showSize = false;
      this.api.getAvgRating(this.skuCode.toUpperCase()).subscribe({
        next: (response) => {
          console.log(response);
          this.productRating = response;
        },
        error: (err) => {
          console.log(err);
        },
      });
      this.api.getProduct(this.skuCode.toUpperCase()).subscribe({
        next: (response) => {
          this.productDetails = response;
          if (response.sizes) {
            this.sizeQuantities = this.productDetails.sizes.map(() => 0);
            this.showSize = true;
            this.quantity = 0;
          } else {
            this.showSize = false;
            this.quantity = 1;
          }
          console.log(this.showSize);
          const price = this.getProductPrice();
          this.subTotal = price * this.quantity;
          this.notFound = false;
          this.showProductCard = true;
          this.isLoadingSection = false;
        },
        error: (error) => {
          console.log(error);
          this.notFound = true;
          this.showProductCard = false;
          this.isLoadingSection = false;
        },
      });
    }
  }

  increment(): void {
    this.quantityError = false;
    this.quantity++;
    const price = this.getProductPrice();
    this.subTotal = price * this.quantity;
  }

  decrement(): void {
    this.quantityError = false;
    if (this.quantity > 1) {
      this.quantity--;
      const price = this.getProductPrice();
      this.subTotal = price * this.quantity;
    }
  }

  validateQuantity(): void {
    this.quantityError = false;
    if (this.quantity == null || isNaN(this.quantity) || this.quantity < 1) {
      this.quantityError = true;
      this.snackBar.open('Please enter a valid Quantity', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
      });
      return;
    }
    const price = this.getProductPrice();
    this.subTotal = price * this.quantity;
  }

  itemHasQuantityError(): boolean {
    const qty = Number(this.quantity);
    return this.quantity == null || isNaN(qty) || qty < 1;
  }

  // Size-wise Quantity Handlers
  incrementSizeQuantity(index: number) {
    this.sizeQuantities[index]++;
    this.calculateTotal();
  }

  decrementSizeQuantity(index: number) {
    if (this.sizeQuantities[index] > 0) {
      this.sizeQuantities[index]--;
      this.calculateTotal();
    }
  }

  validateSizeQuantity(index: number) {
    const value = this.sizeQuantities[index];

    if (isNaN(value) || value < 1) {
      this.sizeQuantities[index] = 1;
    } else {
      this.sizeQuantities[index] = value;
    }

    this.calculateTotal();
  }

  calculateTotal() {
    this.subTotal = this.sizeQuantities.reduce(
      (acc, qty) => acc + qty * this.getProductPrice(),
      0
    );
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

  setRating(rating: number): void {
    this.userRating = rating;
    this.ratingPayload = {
      rating: this.userRating,
      productSku: this.skuCode,
      userId: this.userInfo.emailId,
    };

    if (this.ratingPayload) {
      this.api.saveOrUpdateRating(this.ratingPayload).subscribe({
        next: (response) => {},
        error: (error) => {},
      });
    }
  }

  hoverRating(rating: number): void {
    this.hoveredRating = rating; // Update the hovered rating
  }

  addToCart() {
    if (!this.userInfo) {
      this.api.logout();
      return;
    }

    if (this.quantityError) {
      this.snackBar.open(
        'Please fix the highlighted quantity issues before Placing the Order',
        'Close',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        }
      );

      return;
    }

    let cartRequests: any[] = [];
    this.isLoading = true;
    if (this.showSize) {
      this.productDetails.sizes.forEach((size: any, index: any) => {
        const quantity = this.sizeQuantities[index];

        if (quantity > 0) {
          cartRequests.push({
            emailId: this.userInfo.emailId,
            product: {
              ...this.productDetails,
              sku: `${this.productDetails.sku}_${size}`, // Treat size as unique SKU
            },
            quantity: quantity,
            confirmAddition: false,
          });
        }
      });
    } else {
      cartRequests.push({
        emailId: this.userInfo.emailId,
        product: this.productDetails,
        quantity: this.quantity,
        confirmAddition: false,
      });
    }

    if (cartRequests.length === 0) {
      this.isLoading = false;
      this.snackBar.open(
        'Please select at least one size before adding to cart.',
        'Close',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    this.callCartApi(cartRequests);
  }

  callCartApi(cartRequests: any[]) {
    const currentCount = this.cartService.getCartCount();
    this.api
      .bulkAddToCart(this.userInfo.emailId, cartRequests, false)
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.isLoading = false;
            this.confirmationMessage = response.message;
            const dialogRef = this.dialog.open(this.confirmDialog, {
              id: 'confirm-dialog',
            });

            dialogRef.afterClosed().subscribe((confirmed) => {
              if (confirmed) {
                this.isLoading = true;
                this.api
                  .bulkAddToCart(this.userInfo.emailId, cartRequests, true)
                  .subscribe({
                    next: (finalResponse) => {
                      this.cartService.updateCartCount(
                        currentCount + cartRequests.length
                      );
                      this.isLoading = false;
                      this.showProductCard = false;
                      this.skuCode = '';
                      this.snackBar.open(finalResponse.message, 'Close', {
                        duration: 3000,
                        verticalPosition: 'bottom',
                        horizontalPosition: 'center',
                      });
                    },
                    error: () => {
                      this.isLoading = false;
                      this.snackBar.open(
                        'Error adding items to cart.',
                        'Close',
                        {
                          duration: 3000,
                          verticalPosition: 'bottom',
                          horizontalPosition: 'center',
                        }
                      );
                    },
                  });
              }
            });
          } else {
            this.cartService.updateCartCount(
              currentCount + cartRequests.length
            );
            this.isLoading = false;
            this.showProductCard = false;
            this.skuCode = '';
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
            });
          }
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Error adding items to cart.', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
        },
      });
  }

  closeDialog(confirmed: boolean): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('confirm-dialog')?.close(confirmed);
  }
}
