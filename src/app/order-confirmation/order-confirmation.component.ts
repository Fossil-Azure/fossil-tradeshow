import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('scaleUp', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class OrderConfirmationComponent {
  orderDetails: any = null;

  orderConfirmed = false;
  userInfo: any;
  userCurrency: any;
  totalAmount!: number;
  currencySymbolMap: { [key: string]: string } = {
    USD: '$',
    INR: '₹',
    SGD: 'S$',
    HKD: 'HK$',
    JPY: '¥',
    AUD: 'A$',
  };

  constructor(private router: Router, private api: ApiCallingService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.userCurrency = this.userInfo.currency;
    } else {
      this.userInfo = null;
      api.logout();
    }
    
    const navigation = this.router.getCurrentNavigation();
    this.orderDetails = navigation?.extras?.state?.['orderDetails'] ?? null;

    if(!this.orderDetails) {
      this.router.navigate(['tradeshow/home']);
    }
    
    this.orderDetails = this.orderDetails.items.map((item: any) => ({
      image: item.product.imageUrl,
      name: item.product.productTitle,
      sku: item.product.sku,
      brand: item.product.brand,
      price: this.getProductPrice(item.product),
      quantity: item.quantity,
    }));
  }

  ngOnInit() {
    setTimeout(() => {
      this.orderConfirmed = true;
    }, 1000);
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

  get totalPrice(): number {
    if (!this.orderDetails || this.orderDetails.length === 0) {
      return 0;
    }

    const total = this.orderDetails.reduce((sum: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);

    return parseFloat(total.toFixed(2));
  }

  get currencySymbol(): string {
    return this.currencySymbolMap[this.userCurrency] || '$';
  }

  continueShopping(): void {
    this.router.navigate(['tradeshow/home']);
  }

  goToMyOrders(): void {
    this.router.navigate(['tradeshow/my-orders']);
  }
}
