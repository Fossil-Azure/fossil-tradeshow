import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleUp', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class OrderConfirmationComponent {

  // @Input() orderData: any;

  orderData = {
    items: [
      {
        "product": {
          "sku": "AR11529",
          "productTitle": "Emporio Armani Silver Watch AR11529",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/AR11529_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Emporio Armani",
          "season": "SP25",
          "platform": "Machine",
          "ean": "10231237",
          "upc": "937123918",
          "jpa": "4281829129",
          "mrpUsd": 312.6700134277344,
          "mrpInr": 26995,
          "mrpSgd": 424.8500061035156,
          "mrpHkd": 2431.8798828125,
          "mrpJpy": 42232.28125,
          "mrpAud": 498.239990234375
        },
        "quantity": 7,
        "confirmAddition": false
      },
      {
        "product": {
          "sku": "FS4662",
          "productTitle": "Machine Chronograph Smoke Stainless Steel Watch",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/FS4662_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Fossil",
          "season": "SU24",
          "platform": "Machine",
          "ean": "10231231",
          "upc": "937123912",
          "jpa": "4281829123",
          "mrpUsd": 173.94000244140625,
          "mrpInr": 14995,
          "mrpSgd": 236.1199951171875,
          "mrpHkd": 1349.22998046875,
          "mrpJpy": 23456.2109375,
          "mrpAud": 276.5400085449219
        },
        "quantity": 15,
        "confirmAddition": false
      },
      {
        "product": {
          "sku": "MK7303",
          "productTitle": "Michael Kors Lexington Two Tone Watch MK7303",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/MK7303_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Michael Kors",
          "season": "HO24",
          "platform": "Machine",
          "ean": "10231239",
          "upc": "937123920",
          "jpa": "4281829131",
          "mrpUsd": 254.69000244140625,
          "mrpInr": 21995,
          "mrpSgd": 346.1199951171875,
          "mrpHkd": 1981.8800048828125,
          "mrpJpy": 34420.28125,
          "mrpAud": 406.239990234375
        },
        "quantity": 10,
        "confirmAddition": false
      },
      {
        "product": {
          "sku": "SKW2665",
          "productTitle": "Skagen Stainless Steel Analog White Dial Women Watch-Skw2665, Gold Band",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/SKW2665_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Skagen",
          "season": "SP25",
          "platform": "Machine",
          "ean": "10231236",
          "upc": "937123917",
          "jpa": "4281829128",
          "mrpUsd": 109.8499984741211,
          "mrpInr": 9495,
          "mrpSgd": 149.42999267578125,
          "mrpHkd": 854.9500122070312,
          "mrpJpy": 14847.2802734375,
          "mrpAud": 175.14999389648438
        },
        "quantity": 7,
        "confirmAddition": false
      },
      {
        "product": {
          "sku": "AX5722",
          "productTitle": "AX5722 Leila Analog Watch for Women",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/AX5722_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Armani Exchange",
          "season": "SU24",
          "platform": "Machine",
          "ean": "10231233",
          "upc": "937123914",
          "jpa": "4281829125",
          "mrpUsd": 114.6500015258789,
          "mrpInr": 9925,
          "mrpSgd": 156.14999389648438,
          "mrpHkd": 894.5599975585938,
          "mrpJpy": 15526.2802734375,
          "mrpAud": 183.13999938964844
        },
        "quantity": 4,
        "confirmAddition": false
      },
      {
        "product": {
          "sku": "ES4081",
          "productTitle": "Fossil ES4081 Perfect Boyfriend Multifunction Iron Leather Ladies Watch",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/ES4081_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Fossil",
          "season": "SP25",
          "platform": "Machine",
          "ean": "10231234",
          "upc": "937123915",
          "jpa": "4281829126",
          "mrpUsd": 126.44999694824219,
          "mrpInr": 10925,
          "mrpSgd": 171.94000244140625,
          "mrpHkd": 984.1199951171875,
          "mrpJpy": 17092.279296875,
          "mrpAud": 201.67999267578125
        },
        "quantity": 6,
        "confirmAddition": false
      },
      {
        "product": {
          "sku": "AR60079",
          "productTitle": "Emporio Armani Silver Watch AR60079",
          "imageUrl": "https://fossil.scene7.com/is/image/FossilPartners/AR60079_main?$fossilResponsive_thumb$&wid=350&hei=350",
          "brand": "Emporio Armani",
          "season": "HO24",
          "platform": "Machine",
          "ean": "10231240",
          "upc": "937123921",
          "jpa": "4281829132",
          "mrpUsd": 439.8800048828125,
          "mrpInr": 37995,
          "mrpSgd": 597.8499755859375,
          "mrpHkd": 3422.1298828125,
          "mrpJpy": 59456.2109375,
          "mrpAud": 701.5399780273438
        },
        "quantity": 3,
        "confirmAddition": false
      }
    ], "totalAmount": "812312"
  }

orderConfirmed = false;

ngOnInit() {
  setTimeout(() => {
    this.orderConfirmed = true;
  }, 1000);
}

}
