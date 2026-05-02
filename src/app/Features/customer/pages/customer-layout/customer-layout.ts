import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { NotificationService } from '../../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';
import { NotificationBell } from '../../../../Shared/Components/notification-bell/notification-bell';
import { LangSwitchComponent } from '../../../../Shared/Components/lang-switch/lang-switch';
import { BranchStateService } from '../../../../Core/Services/Branch-Service/branch-state-service';
import { BranchSelector } from '../../components/branch-selector/branch-selector';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CartIcon } from "../../components/cart-icon/cart-icon";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, RouterModule, NotificationBell, BranchSelector, LangSwitchComponent, CartIcon, TranslatePipe],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout implements OnInit {
  isOpen = false;
  isScrolled = false;
  avatarOpen = false;

  UserName = '';
  AvatarLetters = '';
  UserRole = '';
  prefix = 'customer';

  notifications: any[] = [];

  sidebarData = [
    {
      title: 'CUSTOMER.SIDEBAR.DISCOVER',
      links: [
        {
          title: 'CUSTOMER.SIDEBAR.HOME',
          route: 'home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                </svg>`,
        },
        {
          title: 'CUSTOMER.SIDEBAR.AI_SUGGESTIONS',
          route: 'ai-suggest',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
          </svg>`,
        },
        {
          title: 'CUSTOMER.SIDEBAR.BROWSE_MENU',
          route: 'browse-menu',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/>
                  <path d="M4 3v6"/><path d="M6 3v6"/><path d="M5 9v6"/>
                  <path d="M20 3c-2 2-2 6 0 8"/><path d="M20 11v4"/>
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

  logout() {
    this.avatarOpen = false;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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
    if (this.avatarOpen) {
      this.avatarOpen = false;
      return;
    }
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