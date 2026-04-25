import { Component, HostListener } from '@angular/core';
import { NotificationBell } from '../../../../Shared/Components/notification-bell/notification-bell';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../../Shared/Components/sidebar/sidebar';
import { filter } from 'rxjs';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { NotificationService } from '../../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-cashier-layout',
  imports: [RouterOutlet, Sidebar, NotificationBell],
  templateUrl: './cashier-layout.html',
  styleUrl: './cashier-layout.scss',
})
export class CashierLayout {
  isOpen: boolean = false;
  UserName: string = '';
  AvatarLetters: string = '';
  UserRole: string = '';

  pageTitles: any = {
    home: "Home",
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
      title: 'CASHIER',
      links: [
        {
          title: 'Home',
          route: 'home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
</svg>`,
        },
        {
          title: 'Process Payment',
          route: 'Payments',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Card -->
                  <rect x="1.5" y="3" width="13" height="9" rx="1.5"/>
                  <line x1="1.5" y1="6" x2="14.5" y2="6"/>
  
                  <!-- Check -->
                 <path d="M5.5 10l1.5 1.5L10.5 8"/>
                </svg>`,
        },
        {
          title: 'Orders',
          route: 'orders',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Paper -->
                  <path d="M4 2h8v12l-2-1-2 1-2-1-2 1V2z"/>
  
                  <!-- Lines (orders) -->
                  <line x1="6" y1="5" x2="10" y2="5"/>
                  <line x1="6" y1="7" x2="10" y2="7"/>
                  <line x1="6" y1="9" x2="9" y2="9"/>
                </svg>`,
        },
      ],
    },
    {
      title: 'Service',
      links: [
        {
          title: 'New Order',
          route: 'create-order',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Paper -->
                  <rect x="3" y="2" width="10" height="12" rx="1.5"/>
  
                  <!-- Lines -->
                  <line x1="5" y1="5" x2="11" y2="5"/>
                  <line x1="5" y1="7" x2="11" y2="7"/>
  
                  <!-- Plus -->
                  <line x1="8" y1="10" x2="8" y2="13"/>
                  <line x1="6.5" y1="11.5" x2="9.5" y2="11.5"/>
                </svg>`,
        },
      ],
    },
    {
      title: 'Delivery',
      links: [
        {
          title: 'Assign Drivers',
          route: 'assign-deliveries',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Car -->
                  <rect x="2" y="7" width="12" height="4" rx="1"/>
                  <path d="M4 7l1.5-2h5L12 7"/>
                  <circle cx="5" cy="12" r="1"/>
                  <circle cx="11" cy="12" r="1"/>

                  <!-- User -->
                  <circle cx="12.5" cy="4" r="1.5"/>
                  <path d="M10.5 6.5c0-1.2 1-2 2-2s2 .8 2 2"/>
                </svg>`,
        },
      ],
    },
    {
      title: 'Account',
      links: [
        {
          title: 'My Profile',
          route: 'profile',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Circle -->
                  <circle cx="8" cy="8" r="6"/>
  
                  <!-- Head -->
                  <circle cx="8" cy="6" r="2"/>
  
                  <!-- Body -->
                  <path d="M5 11c1-1.5 5-1.5 6 0"/>
                </svg>`,
        },
      ],
    },
  ];

  notifications: any[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private signalR: SignalRService,
    private toast: ToastService,
  ) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url.split('/').pop() || '';
      this.topbarTitle = this.pageTitles[url] || 'Cashier';
    });
  }
  ngOnInit(): void {
    this.GetCurrentUser();
        this.loadNotifications();

    let token = this.authService.getAccessToken();
    this.signalR.startNotificationsConnection(token??"");


  //   this.signalR.onNotification("",(data) => {
  //     debugger;
  //     this.notifications.unshift(data);

  //     this.toast.show(
  //       data.title,
  //       'notification'
  //     );
  //   });
  }

    loadNotifications() {
    this.notificationService.getMyNotifications()
      .subscribe(res => this.notifications = res);
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
