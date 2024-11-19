import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  inputText: string = '';
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
  productTitle: any;
  brandName: any;
  season: any;
  platform: any;
  msrp: any;
  quantity: any;
  subTotal: any;
  hoveredRating = 0;

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

  increaseQuantity(): void {
    this.productQuantity++;
  }

  decreaseQuantity(): void {
    if (this.productQuantity > 1) {
      this.productQuantity--;
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
