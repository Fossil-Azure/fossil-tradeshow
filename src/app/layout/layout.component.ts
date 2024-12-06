import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
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