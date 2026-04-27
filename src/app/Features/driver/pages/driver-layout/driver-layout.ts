import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { NotificationService } from '../../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';
import { NotificationBell } from '../../../../Shared/Components/notification-bell/notification-bell';
import { Sidebar } from '../../../../Shared/Components/sidebar/sidebar';
import { LangSwitchComponent } from "../../../../Shared/Components/lang-switch/lang-switch";

@Component({
  selector: 'app-driver-layout',
  imports: [RouterOutlet, Sidebar, NotificationBell, LangSwitchComponent],
  templateUrl: './driver-layout.html',
  styleUrl: './driver-layout.scss',
})
export class DriverLayout {
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
      title: 'Deliveries',
      links: [
         {
          title: 'Home',
          route: 'home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                </svg>`,
        },
         {
          title: 'Active Delivery',
          route: 'deliveries',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Wheels -->
                  <circle cx="6" cy="18" r="2"/>
                  <circle cx="18" cy="18" r="2"/>

                  <!-- Bike frame -->
                  <path d="M6 18l4-6h4l4 6"/>
                  <path d="M10 12l-2-4h4"/>

                  <!-- Delivery box -->
                  <rect x="14" y="6" width="4" height="4" rx="1"/>

                  <!-- Rider -->
                  <circle cx="10" cy="6" r="1.5"/>
                  <path d="M10 7.5v2.5l2 2"/>

                </svg>`,
        },
         {
          title: 'History',
          route: 'delivery-history',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Clock circle -->
                  <circle cx="12" cy="12" r="9"/>

                  <!-- Clock arrow -->
                  <polyline points="12 7 12 12 16 14"/>

                  <!-- History arrow -->
                  <path d="M3 12a9 9 0 1 1 3 6"/>

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
      this.topbarTitle = this.pageTitles[url] || 'driver';
    });
  }
  ngOnInit(): void {
    this.GetCurrentUser();
        this.loadNotifications();

    let token = this.authService.getAccessToken();
    this.signalR.startNotificationsConnection(token??"");


    this.signalR.onNotification("OrderAssignedToDriver",(data) => {
      debugger;
      this.notifications.unshift(data);

      this.toast.show(
        data.title,
        'notification'
      );
    });
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
