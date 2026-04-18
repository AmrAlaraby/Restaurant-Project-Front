import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../Core/Services/Notification-Service/NotificatoinService';
import { SignalRService } from '../../../Core/Services/SignalR-Service/SignalrService';
import { ToastService } from '../../../Core/Services/Toast-Service/toast-service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports : [DatePipe],
  templateUrl: './notification-bell.html',
})
export class NotificationBell implements OnInit {

  notifications: any[] = [];
  isOpen = false;

  constructor(
    private notificationService: NotificationService,
    private signalR: SignalRService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadNotifications();

    const token = localStorage.getItem('token')!;
    this.signalR.startConnection(token);

    this.signalR.onNotification((data) => {
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