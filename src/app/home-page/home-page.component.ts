import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  inputText: string = 'FS4662';
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
  productTitle = 'Machine Chronograph Smoke Stainless Steel Watch';
  brandName = "Fossil";
  season = "SU24";
  platform = "Machine";
  msrp = 180;
  quantity = 1;
  subTotal = this.msrp * this.quantity;
  hoveredRating = 0;
  isMobile = false;
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128];

  constructor(private breakpointObserver: BreakpointObserver) {
    // Observe screen size changes using BreakpointObserver
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
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
    this.inputText = result;  // Fill the input field with scanned text
    this.closeScanner();
  }

  // Select the first available camera
  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    if (devices && devices.length > 0) {
      this.selectedDevice = devices[0];  // Select the first camera
    }
  }

  // Clear the input field
  clearInput(): void {
    this.inputText = '';
    console.log('Input cleared');
  }

  // Action to perform when text is entered or QR is scanned
  performAction(): void {
    if (this.inputText) {
      console.log('Performing action with:', this.inputText);
      // Add your custom logic here
    } else {
      console.log('No input to perform the action with.');
    }
  }

  increment(): void {
    this.quantity++;
    this.subTotal = this.quantity * this.msrp;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.subTotal = this.quantity * this.msrp;
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
}
