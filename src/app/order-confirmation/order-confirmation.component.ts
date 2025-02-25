import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { CartserviceService } from '../../shared/CartService/cartservice.service';

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

  constructor(
    private router: Router,
    api: ApiCallingService,
    private cartService: CartserviceService
  ) {
    this.cartService.fetchCart();
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.userCurrency = this.userInfo.currency;
    } else {
      this.userInfo = null;
      api.logout();
    }

    const navigation = this.router.getCurrentNavigation();
    // this.orderDetails = navigation?.extras?.state?.['orderDetails'] ?? null;

    this.orderDetails = {
      id: '67bd76280f28121333cbefc1',
      emailId: 'testuser@fossil.com',
      items: [
        {
          product: {
            sku: 'FS4662',
            productTitle: 'Machine Chronograph Smoke Stainless Steel Watch',
            imageUrl:
              'https://fossil.scene7.com/is/image/FossilPartners/FS4662_main?$fossilResponsive_thumb$&wid=350&hei=350',
            brand: 'Fossil',
            season: 'SU24',
            platform: 'Machine',
            ean: ['4064092120073'],
            upc: ['937123912'],
            jan: ['4281829123'],
            mrpUsd: 173.94,
            mrpInr: 14995,
            mrpSgd: 236.12,
            mrpHkd: 1349.23,
            mrpJpy: 23456.21,
            mrpAud: 276.54,
            sizes: null,
            category: null,
          },
          quantity: 10,
          confirmAddition: false,
          subtotalHkd: 13492.3,
        },
        {
          product: {
            sku: 'JF04834710_5',
            productTitle: 'Fossil Sadie Gold Ring JF04834710',
            imageUrl:
              'https://fossil.scene7.com/is/image/FossilPartners/JF04834710_main?$fossilResponsive_thumb$&wid=350&hei=350',
            brand: 'Fossil',
            season: 'SP24',
            platform: 'Sadie',
            ean: [
              '4064092329896',
              '4064092329902',
              '4064092329919',
              '4064092329926',
              '4064092329933',
            ],
            upc: [
              '796483677234',
              '796483677241',
              '796483677258',
              '796483677265',
              '796483677272',
            ],
            jan: [
              '4570006769707',
              '4570006769714',
              '4570006769721',
              '4570006769738',
              '4570006769745',
            ],
            mrpUsd: 30,
            mrpInr: 2607.87,
            mrpSgd: 40.5,
            mrpHkd: 233.82,
            mrpJpy: 3240,
            mrpAud: 46.54,
            sizes: ['5', '6', '7', '8', '9'],
            category: null,
          },
          quantity: 5,
          confirmAddition: false,
          subtotalHkd: 1169.1,
        },
        {
          product: {
            sku: 'JF04834710_6',
            productTitle: 'Fossil Sadie Gold Ring JF04834710',
            imageUrl:
              'https://fossil.scene7.com/is/image/FossilPartners/JF04834710_main?$fossilResponsive_thumb$&wid=350&hei=350',
            brand: 'Fossil',
            season: 'SP24',
            platform: 'Sadie',
            ean: [
              '4064092329896',
              '4064092329902',
              '4064092329919',
              '4064092329926',
              '4064092329933',
            ],
            upc: [
              '796483677234',
              '796483677241',
              '796483677258',
              '796483677265',
              '796483677272',
            ],
            jan: [
              '4570006769707',
              '4570006769714',
              '4570006769721',
              '4570006769738',
              '4570006769745',
            ],
            mrpUsd: 30,
            mrpInr: 2607.87,
            mrpSgd: 40.5,
            mrpHkd: 233.82,
            mrpJpy: 3240,
            mrpAud: 46.54,
            sizes: ['5', '6', '7', '8', '9'],
            category: null,
          },
          quantity: 5,
          confirmAddition: false,
          subtotalHkd: 1169.1,
        },
        {
          product: {
            sku: 'JF04834710_7',
            productTitle: 'Fossil Sadie Gold Ring JF04834710',
            imageUrl:
              'https://fossil.scene7.com/is/image/FossilPartners/JF04834710_main?$fossilResponsive_thumb$&wid=350&hei=350',
            brand: 'Fossil',
            season: 'SP24',
            platform: 'Sadie',
            ean: [
              '4064092329896',
              '4064092329902',
              '4064092329919',
              '4064092329926',
              '4064092329933',
            ],
            upc: [
              '796483677234',
              '796483677241',
              '796483677258',
              '796483677265',
              '796483677272',
            ],
            jan: [
              '4570006769707',
              '4570006769714',
              '4570006769721',
              '4570006769738',
              '4570006769745',
            ],
            mrpUsd: 30,
            mrpInr: 2607.87,
            mrpSgd: 40.5,
            mrpHkd: 233.82,
            mrpJpy: 3240,
            mrpAud: 46.54,
            sizes: ['5', '6', '7', '8', '9'],
            category: null,
          },
          quantity: 2,
          confirmAddition: false,
          subtotalHkd: 467.64,
        },
        {
          product: {
            sku: 'JF04834710_8',
            productTitle: 'Fossil Sadie Gold Ring JF04834710',
            imageUrl:
              'https://fossil.scene7.com/is/image/FossilPartners/JF04834710_main?$fossilResponsive_thumb$&wid=350&hei=350',
            brand: 'Fossil',
            season: 'SP24',
            platform: 'Sadie',
            ean: [
              '4064092329896',
              '4064092329902',
              '4064092329919',
              '4064092329926',
              '4064092329933',
            ],
            upc: [
              '796483677234',
              '796483677241',
              '796483677258',
              '796483677265',
              '796483677272',
            ],
            jan: [
              '4570006769707',
              '4570006769714',
              '4570006769721',
              '4570006769738',
              '4570006769745',
            ],
            mrpUsd: 30,
            mrpInr: 2607.87,
            mrpSgd: 40.5,
            mrpHkd: 233.82,
            mrpJpy: 3240,
            mrpAud: 46.54,
            sizes: ['5', '6', '7', '8', '9'],
            category: null,
          },
          quantity: 1,
          confirmAddition: false,
          subtotalHkd: 233.82,
        },
      ],
      totalUsd: 2129.4,
      totalInr: 183852.31,
      totalSgd: 2887.7,
      totalHkd: 16531.96,
      totalJpy: 276682.1,
      totalAud: 3370.42,
      orderDate: '2025-02-25 13:20:00',
    };

    if (!this.orderDetails) {
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
