import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { NotificationService } from '../../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';
import { NotificationBell } from '../../../../Shared/Components/notification-bell/notification-bell';
import { Sidebar } from '../../../../Shared/Components/sidebar/sidebar';
import { LangSwitchComponent } from "../../../../Shared/Components/lang-switch/lang-switch";
import { CartIcon } from "../../components/cart-icon/cart-icon";
import { BranchStateService } from '../../../../Core/Services/Branch-Service/branch-state-service';
import { BranchSelector } from "../../components/branch-selector/branch-selector";
imports: [RouterOutlet, Sidebar, NotificationBell, LangSwitchComponent]
@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, Sidebar, NotificationBell, CartIcon, BranchSelector, LangSwitchComponent],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout {
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
      title: 'Discover',
      links: [
         {
          title: 'Home',
          route: 'home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                </svg>`,
        },
           {
          title: 'AI Suggestions',
          route: 'ai-suggest',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
        </svg>`,
        },
         {
          title: 'Browse Menu',
          route: 'browse-menu',
          icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Plate -->
                  <circle cx="12" cy="13" r="5"/>
                  <circle cx="12" cy="13" r="2"/>

                  <!-- Fork -->
                  <path d="M4 3v6"/>
                  <path d="M6 3v6"/>
                  <path d="M5 9v6"/>

                  <!-- Knife -->
                  <path d="M20 3c-2 2-2 6 0 8"/>
                  <path d="M20 11v4"/>

                  <!-- Menu lines (top like list) -->
                  <line x1="9" y1="4" x2="15" y2="4"/>
                  <line x1="10" y1="7" x2="14" y2="7"/>

                </svg>`,
        }
      ],
    },
    {
      title: 'My Orders',
      links: [
        {
          title: 'My Orders',
          route: 'my-orders',
          icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Clipboard -->
                  <rect x="6" y="4" width="12" height="16" rx="2"/>
                  <path d="M9 4h6v2H9z"/>

                  <!-- Checklist -->
                  <path d="M9 10l1.5 1.5L13 9"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>

                  <!-- User badge (top corner) -->
                  <circle cx="18" cy="6" r="2"/>
                  <path d="M16.5 9c.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5"/>

                  <!-- Notification dot -->
                  <circle cx="18" cy="11" r="1" fill="currentColor"/>

                </svg>`,
        },
        {
          title: 'Cart',
          route: 'basket',
          icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Cart base -->
                  <path d="M3 5h2l2.5 10h10l2-7H7"/>

                  <!-- Wheels -->
                  <circle cx="10" cy="18" r="1.8"/>
                  <circle cx="17" cy="18" r="1.8"/>

                  <!-- Items inside -->
                  <circle cx="9" cy="9" r="1"/>
                  <circle cx="13" cy="9" r="1"/>
                  <circle cx="11" cy="12" r="1"/>

                  <!-- Checkout arrow -->
                  <path d="M20 4v4h-4"/>
                  <path d="M20 8l-4-4"/>

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
          icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- User -->
                  <circle cx="12" cy="8" r="3"/>
                  <path d="M4 19c0-3 3.5-5 8-5s8 2 8 5"/>

                  <!-- Profile card -->
                  <rect x="3" y="3" width="18" height="18" rx="3"/>

                  <!-- Small settings indicator -->
                  <circle cx="18" cy="6" r="1"/>
                  <path d="M18 5v2M17 6h2"/>

                </svg>`,
        },
        {
          title: 'Addresses',
          route: 'saved-addresses',
          icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Map folds -->
                  <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/>

                  <!-- Main pin -->
                  <path d="M12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                  <path d="M12 13c-2 3-4 5-4 7"/>

                  <!-- Secondary saved pins -->
                  <circle cx="7" cy="10" r="1"/>
                  <circle cx="17" cy="9" r="1"/>

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
    private branchState: BranchStateService
  ) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url.split('/').pop() || '';
      this.topbarTitle = this.pageTitles[url] || 'Good morning';
    });
  }
  ngOnInit(): void {
    this.GetCurrentUser();
    this.loadNotifications();
    this.branchState.loadBranches();

    let token = this.authService.getAccessToken();
    this.signalR.startNotificationsConnection(token??"");


    this.signalR.onNotification("DeliveryStatusChange",(data) => {
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
