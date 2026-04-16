import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from '../../../../Shared/Components/sidebar/sidebar';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  isOpen: boolean = false;
  UserName: string = '';
  AvatarLetters: string = '';
  UserRole: string = '';

  pageTitles: any = {
    dashboard: 'Dashboard',
    orders: 'Order Management',
    kitchen: 'Kitchen Display',
    tables: 'Table Management',
    deliveries: 'Deliveries',
    payments: 'Payments',
    menu: 'Menu Items',
    stock: 'Stock',
    categories: 'Categories',
    users: 'Users',
    branches: 'Branches',
    reports: 'Reports',
    settings: 'Settings',
  };

  topbarTitle = '';

  sidebarData = [
    {
      title: 'Overview',
      links: [
        {
          title: 'Dashboard',
          route: 'dashboard',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>`,
        },
      ],
    },
    {
      title: 'Operations',
      links: [
        {
          title: 'Orders',
          route: 'orders',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M5 3V2M11 3V2M2 7h12"/>
              </svg>`,
        },
        {
          title: 'Kitchen',
          route: 'kitchen',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 13V7l5-4 5 4v6"/><path d="M6 13v-3h4v3"/>
              </svg>`,
        },
        {
          title: 'Tables',
          route: 'tables',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="5" width="14" height="8" rx="1"/><path d="M4 5V4a2 2 0 014 0v1M8 5V4a2 2 0 014 0v1"/>
              </svg>`,
        },
        {
          title: 'Deliveries',
          route: 'deliveries',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="6" r="3"/><path d="M2 13c0-2.5 2.2-4 4-4s4 1.5 4 4"/>
                <circle cx="12" cy="6" r="2"/><path d="M15 13c0-2-1.5-3-3-3"/>
              </svg>`,
        },
        {
          title: 'Payments',
          route: 'payments',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="14" height="9" rx="1"/><path d="M1 8h14"/>
              </svg>`,
        },
      ],
    },
    {
      title: 'Catalogue',
      links: [
        {
          title: 'Menu Items',
          route: 'menu-items',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z"/>
              </svg>`,
        },
        {
          title: 'Stock',
          route: 'branch-stock',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5 8h6M8 5v6"/>
              </svg>`,
        },
        {
          title: 'Categories',
          route: 'categories',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 2l1.5 3H13l-2.7 2 1 3.2L8 8.5l-3.3 1.7 1-3.2L3 5h3.5z"/>
              </svg>`,
        },
        {
          title: 'Ingredients',
          route: 'ingredients',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 2a4 4 0 0 1 4 4c0 4-4 8-4 8S4 10 4 6a4 4 0 0 1 4-4z"/><circle cx="8" cy="6" r="1.5"/>
              </svg>`,
        },
      ],
    },
    {
      title: 'Management',
      links: [
        {
          title: 'Users',
          route: 'users',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="5" r="2.5"/><path d="M1 13c0-2.5 2.2-4 5-4s5 1.5 5 4"/>
                <circle cx="12" cy="5" r="2"/><path d="M15 13c0-2-1.5-3-3-3"/>
              </svg>`,
        },
        {
          title: 'Branches',
          route: 'branches',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 13V7l5-4 5 4v6M6 13v-3h4v3"/>
              </svg>`,
        },  
      ],
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url.split('/').pop() || '';
      this.topbarTitle = this.pageTitles[url] || 'Dashboard';
    });
  }
  ngOnInit(): void {
    this.GetCurrentUser();
  }

  /* SIDEBAR CONTROL */
  openSidebar() {
    console.log('clicked');

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

  GetCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log(res);
        this.UserName = res.name;
        this.UserRole = res.role;
        this.AvatarLetters = res.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
