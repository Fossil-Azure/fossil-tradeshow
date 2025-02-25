import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartserviceService } from '../../shared/CartService/cartservice.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent {
  isLoading: boolean = false;
  userInfo: any;
  userCurrency: any;
  orders: any[] = []; // Stores all orders
  selectedOrder: any = null; // Stores the currently selected order for details
  isEditMode: boolean = false;
  orderCopy: any;
  changes: any[] = [];

  @ViewChild('deleteOrderPopUp')
  deleteOrderPopUp!: TemplateRef<any>;

  @ViewChild('saveUpdatedOrder')
  saveUpdatedOrder!: TemplateRef<any>;

  constructor(
    private api: ApiCallingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.api.getUsersOrders(this.userInfo.emailId).subscribe({
      next: (response) => {
        this.orders = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isLoading = false;
      },
    });
  }

  // Toggle Edit Mode
  toggleEditMode(order: any) {
    if (order) {
      this.selectedOrder = order;
    } else {
      this.selectedOrder = JSON.parse(JSON.stringify(this.orderCopy));
    }
    this.isEditMode = !this.isEditMode;
  }

  getProductPrice(product: any): number {
    const currencyKey = `mrp${this.userCurrency
      .charAt(0)
      .toUpperCase()}${this.userCurrency.slice(1).toLowerCase()}`;
    return product[currencyKey] || 0;
  }

  getTotalPrice(product: any): number {
    return product.items.reduce((sum: any, item: any) => {
      return sum + item.quantity * this.getProductPrice(item.product);
    }, 0);
  }

  // Update Total Prices Dynamically
  updateTotals(): void {
    this.selectedOrder.totalUsd = this.selectedOrder.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.product.mrpUsd,
      0
    );

    this.selectedOrder.totalInr = this.selectedOrder.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.product.mrpInr,
      0
    );

    this.selectedOrder.totalSgd = this.selectedOrder.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.product.mrpSgd,
      0
    );

    this.selectedOrder.totalHkd = this.selectedOrder.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.product.mrpHkd,
      0
    );

    this.selectedOrder.totalJpy = this.selectedOrder.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.product.mrpJpy,
      0
    );

    this.selectedOrder.totalAud = this.selectedOrder.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.product.mrpAud,
      0
    );
  }

  get currencySymbol(): string {
    switch (this.userCurrency) {
      case 'USD':
        return '$';
      case 'INR':
        return '₹';
      case 'SGD':
        return 'S$';
      case 'HKD':
        return 'HK$';
      case 'JPY':
        return '¥';
      case 'AUD':
        return 'A$';
      default:
        return '$';
    }
  }

  viewOrderDetails(order: any) {
    this.selectedOrder = order;
    this.orderCopy = JSON.parse(JSON.stringify(order));
  }

  // Remove Item from Order
  removeItem(index: number) {
    const dialogRef = this.dialog.open(this.deleteOrderPopUp, {
      id: 'delete-order-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedOrder.items.splice(index, 1);
        this.updateTotals();
        this.snackBar.open(`Item removed successfully`, 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
        });
      } else {
        console.log('Delete Cancelled');
      }
    });
  }

  // Increase Quantity
  increaseQuantity(index: number) {
    this.selectedOrder.items[index].quantity++;
    this.updateTotals();
  }

  // Decrease Quantity
  decreaseQuantity(index: number) {
    if (this.selectedOrder.items[index].quantity > 1) {
      this.selectedOrder.items[index].quantity--;
      this.updateTotals();
    }
  }

  validateQuantity(item: any): void {
    const value = parseInt(item.quantity, 10);

    if (!value || value < 1) {
      item.quantity = 1;
    } else {
      item.quantity = value;
    }
  }

  // Save Changes
  saveChanges() {
    this.isEditMode = false;
    this.calculateDifferences();
    const dialogRef = this.dialog.open(this.saveUpdatedOrder, {
      id: 'update-order-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.api.updateOrder(this.selectedOrder, this.changes).subscribe({
          next: (response) => {
            this.backToOrders();
            this.fetchOrders();
            this.isLoading = false;
            this.snackBar.open(`Order Updated Successfully`, 'Close', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: ['success-snackbar'],
            });
          },
          error: (error) => {
            this.toggleEditMode(this.selectedOrder);
            this.isLoading = false;
            this.snackBar.open(`Something went wrong`, 'Close', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: ['success-snackbar'],
            });
          },
        });
      } else {
        this.toggleEditMode(this.selectedOrder);
      }
    });
  }

  hasUpdatedChanges(): boolean {
    return this.changes.some((change) => change.change === 'Updated');
  }

  // Delete Entire Order
  deleteOrder(orderId: any) {
    const dialogRef = this.dialog.open(this.deleteOrderPopUp, {
      id: 'delete-order-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isEditMode = false;
        this.selectedOrder = null;
        this.snackBar.open(`Order Deleted Successfully`, 'Close', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
        });
      } else {
        console.log('Delete Cancelled');
      }
    });
  }

  closeOrderDeleteDialog(confirmed: boolean): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('delete-order-dialog')?.close(confirmed);
  }

  // Go Back to Orders
  backToOrders() {
    this.isEditMode = false;
    this.selectedOrder = null;
  }

  calculateDifferences() {
    this.changes = [];

    // Track all SKUs
    const allSkus = new Set([
      ...this.selectedOrder.items.map((item: any) => item.product.sku),
      ...this.orderCopy.items.map((item: any) => item.product.sku),
    ]);

    allSkus.forEach((sku) => {
      const newItem = this.selectedOrder.items.find(
        (item: any) => item.product.sku === sku
      );
      const oldItem = this.orderCopy.items.find(
        (item: any) => item.product.sku === sku
      );

      let changeType = 'Unchanged';
      let highlightClass = ''; // For color coding changes

      if (!oldItem) {
        changeType = 'Added';
        highlightClass = 'green'; // Green for added items
      } else if (!newItem) {
        changeType = 'Removed';
        highlightClass = 'red'; // Red for removed items
      } else if (newItem.quantity !== oldItem.quantity) {
        changeType = 'Updated';
        highlightClass = newItem.quantity > oldItem.quantity ? 'green' : 'red'; // Green for increase, Red for decrease
      }

      this.changes.push({
        product: oldItem
          ? oldItem.product.productTitle
          : newItem.product.productTitle,
        sku: sku,
        oldQuantity: oldItem ? oldItem.quantity : 0,
        newQuantity: newItem ? newItem.quantity : 0,
        change: changeType,
        highlightClass: highlightClass,
      });
    });
  }

  closeEditOrderDialog(confirmed: boolean): void {
    this.dialog.closeAll();
    this.dialog.getDialogById('update-order-dialog')?.close(confirmed);
  }
}
