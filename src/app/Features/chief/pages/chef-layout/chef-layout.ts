import { Component, HostListener } from '@angular/core';
import { NotificationBell } from '../../../../Shared/Components/notification-bell/notification-bell';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../../Shared/Components/sidebar/sidebar';
import { filter } from 'rxjs';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { NotificationService } from '../../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';
import { LangSwitchComponent } from "../../../../Shared/Components/lang-switch/lang-switch";

@Component({
  selector: 'app-chef-layout',
  imports: [RouterOutlet, Sidebar, NotificationBell, LangSwitchComponent],
  templateUrl: './chef-layout.html',
  styleUrl: './chef-layout.scss',
})
export class ChefLayout {
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
      title: 'Kitchen',
      links: [
        {
          title: 'Kitchen Board',
          route: 'kitchen',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Spoon -->
                  <circle cx="5" cy="4" r="1.5"/>
                  <line x1="5" y1="5.5" x2="5" y2="13"/>
  
                  <!-- Fork -->
                  <line x1="10" y1="3" x2="10" y2="13"/>
                  <line x1="9" y1="3" x2="9" y2="6"/>
                  <line x1="11" y1="3" x2="11" y2="6"/>
                </svg>`,
        },
      ],
    },
    {
      title: 'Inventory',
      links: [
        {
          title: 'Check Stock',
          route: 'stock',
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Box -->
                  <rect x="2" y="3" width="12" height="10" rx="1.5"/>
  
                  <!-- Lines -->
                  <line x1="2" y1="7" x2="14" y2="7"/>
  
                  <!-- Check 
                  <path d="M5 10l2 2 4-4"/>-->
                </svg>`,
        },
        {
          title: 'Recipes',
          route: 'Recipes',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round">

                  <!-- Book cover -->
                  <path d="M4 3h12a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z"/>

                  <!-- Pages -->
                  <path d="M4 3v18"/>

                  <!-- Recipe lines -->
                  <line x1="8" y1="8" x2="16" y2="8"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="8" y1="16" x2="13" y2="16"/>

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
      this.topbarTitle = this.pageTitles[url] || 'Kitchen';
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
