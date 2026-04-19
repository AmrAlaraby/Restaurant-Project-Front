import { AuthService } from './../../../Core/Services/Auth-Service/auth-service';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../Core/Services/Toast-Service/toast-service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports : [DatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
})
export class NotificationBell implements OnInit {

  @Input() notifications: any[] = [];
  isOpen = false;

  constructor(
    private notificationService: NotificationService,
    private signalR: SignalRService,
    private toast: ToastService,
    private AuthService : AuthService
  ) {}

  ngOnInit() {

  }


  toggle() {
    this.isOpen = !this.isOpen;
  }

  markAsRead(n: any) {
    this.notificationService.markAsRead(n.id)
      .subscribe(() => n.isRead = true);
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }
}

function Inbut(target: NotificationBell, propertyKey: ''): void {
  throw new Error('Function not implemented.');
}
