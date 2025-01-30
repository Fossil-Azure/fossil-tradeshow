import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';
import { CartserviceService } from '../../shared/CartService/cartservice.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isExpanded = false;
  showMobileMenu = false;
  isMobile = false;

  menuItems = [
    { name: 'Home', icon: 'home', route: '/tradeshow/home' },
    { name: 'Profile', icon: 'person', route: '/tradeshow/profile' },
    { name: 'Settings', icon: 'settings', route: '/tradeshow/settings' },
    { name: 'Logout', icon: 'logout', route: '/tradeshow/logout' }
  ];
  userInfo: any;
  userCurrency: any;
  badgeCount = 0;

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private api: ApiCallingService,
    private loader: LoaderServiceService, private cartService: CartserviceService) {
    // Observe screen size changes using BreakpointObserver
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        console.log(this.isMobile)
        if (this.isMobile) {
          this.isExpanded = false; // Collapse sidenav on small screens
          this.showMobileMenu = false; // Hide mobile menu initially
        }
      });

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
    this.loader.show()
    this.api.getCart(this.userInfo.emailId).subscribe({
      next: (response) => {
        if(response) {
          this.badgeCount = response.items.length
          this.cartService.updateCartCount(this.badgeCount);
        }
        this.loader.hide()
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.loader.hide()
      }
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
    this.router.navigate([route]);
  }
}