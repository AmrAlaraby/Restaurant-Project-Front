import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from "../../../../Shared/Components/sidebar/sidebar";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
    isOpen = false;


  pageTitles: any = {
    dashboard:  'Dashboard',
    orders:     'Order Management',
    kitchen:    'Kitchen Display',
    tables:     'Table Management',
    deliveries: 'Deliveries',
    payments:   'Payments',
    menu:       'Menu Items',
    stock:      'Stock',
    categories: 'Categories',
    users:      'Users',
    branches:   'Branches',
    reports:    'Reports',
    settings:   'Settings',
  };

  topbarTitle = '';

  constructor(private router: Router) {

    /* 🔥 أهم جزء */
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('/').pop() || '';
        this.topbarTitle = this.pageTitles[url]  || 'Dashboard';
      });
  }

  /* SIDEBAR CONTROL */
  openSidebar() {
    console.log("clicked");
    
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  /* ESC */
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) this.closeSidebar();
  }

  /* RESIZE */
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }
}
