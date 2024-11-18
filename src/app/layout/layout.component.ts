import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
    { name: 'Home', icon: 'home' },
    { name: 'Profile', icon: 'person' },
    { name: 'Settings', icon: 'settings' },
    { name: 'Logout', icon: 'logout' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
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
}