import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';
import { CartserviceService } from '../../shared/CartService/cartservice.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  isExpanded = false;
  showMobileMenu = false;
  isMobile = false;

  menuItems = [
    { name: 'Home', icon: 'home', route: '/tradeshow/home' },
    { name: 'My Orders', icon: 'receipt_long', route: '/tradeshow/my-orders' },
    { name: 'Profile', icon: 'person', route: '/tradeshow/user-profile' },
    { name: 'Logout', icon: 'logout', route: '/login' },
  ];
  userInfo: any;
  userCurrency: any;
  badgeCount = 0;
  isLoading: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private api: ApiCallingService,
    private loader: LoaderServiceService,
    private cartService: CartserviceService
  ) {
    // Observe screen size changes using BreakpointObserver
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.isExpanded = false; // Collapse sidenav on small screens
          this.showMobileMenu = false; // Hide mobile menu initially
        }
      });

    this.cartService.fetchCart();
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.userCurrency = this.userInfo.currency;
      this.cartService.cartCount$.subscribe((count) => {
        this.badgeCount = count;
      });
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
          this.badgeCount = response.items.length;
          this.cartService.updateCartCount(this.badgeCount);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.isLoading = false;
      },
    });
  }

  expand() {
    this.isExpanded = true;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.isExpanded = this.showMobileMenu; // Expand when the menu is shown
  }

  redirectToCart(): void {
    this.router.navigate(['/tradeshow/cart']);
  }

  navigateTo(route: string): void {
    this.showMobileMenu = false
    if (route == '/login') {
      this.api.logout();
    } else {
      this.router.navigate([route]);
    }
  }
}
