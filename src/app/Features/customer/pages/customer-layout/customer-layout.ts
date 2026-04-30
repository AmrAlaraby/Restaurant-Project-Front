import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { NotificationService } from '../../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';
import { NotificationBell } from '../../../../Shared/Components/notification-bell/notification-bell';
import { LangSwitchComponent } from '../../../../Shared/Components/lang-switch/lang-switch';
import { CartIcon } from '../../components/cart-icon/cart-icon';
import { BranchStateService } from '../../../../Core/Services/Branch-Service/branch-state-service';
import { BranchSelector } from '../../components/branch-selector/branch-selector';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, RouterModule, NotificationBell, CartIcon, BranchSelector, LangSwitchComponent],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout implements OnInit {
  isOpen = false;
  isScrolled = false;
  UserName = '';
  AvatarLetters = '';
  UserRole = '';
  prefix = 'customer';

  notifications: any[] = [];

  sidebarData = [
    {
      title: 'Discover',
      links: [
        {
          title: 'Home',
          route: 'home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                </svg>`,
        },
        {
          title: 'AI Suggestions',
          route: 'ai-suggest',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
          </svg>`,
        },
        {
          title: 'Browse Menu',
          route: 'browse-menu',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/>
                  <path d="M4 3v6"/><path d="M6 3v6"/><path d="M5 9v6"/>
                  <path d="M20 3c-2 2-2 6 0 8"/><path d="M20 11v4"/>
                </svg>`,
        },
      ],
    },
    {
      title: 'My Orders',
      links: [
        {
          title: 'My Orders',
          route: 'my-orders',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="6" y="4" width="12" height="16" rx="2"/>
                  <path d="M9 4h6v2H9z"/>
                  <path d="M9 10l1.5 1.5L13 9"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>`,
        },
        {
          title: 'Cart',
          route: 'basket',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 5h2l2.5 10h10l2-7H7"/>
                  <circle cx="10" cy="18" r="1.8"/>
                  <circle cx="17" cy="18" r="1.8"/>
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
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="3"/>
                  <path d="M4 19c0-3 3.5-5 8-5s8 2 8 5"/>
                </svg>`,
        },
        {
          title: 'Addresses',
          route: 'saved-addresses',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/>
                  <path d="M12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                  <path d="M12 13c-2 3-4 5-4 7"/>
                </svg>`,
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private signalR: SignalRService,
    private toast: ToastService,
    private branchState: BranchStateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.GetCurrentUser();
    this.loadNotifications();
    this.branchState.loadBranches();

    const token = this.authService.getAccessToken();
    this.signalR.startNotificationsConnection(token ?? '');

    this.signalR.onNotification('DeliveryStatusChange', (data) => {
      this.notifications.unshift(data);
      this.toast.show(data.title, 'notification');
    });
  }

  sanitize(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  loadNotifications() {
    this.notificationService.getMyNotifications().subscribe((res) => (this.notifications = res));
  }

  goToProfile() {
    this.router.navigate(['/customer/profile']);
  }

  openSidebar() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) this.closeSidebar();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024) {
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }

  GetCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.UserName = res.name;
        this.UserRole = res.role;
        this.AvatarLetters = res.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase();
      },
      error: (err) => console.log(err),
    });
  }

  
}
