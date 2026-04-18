import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../../Constants/Api_Urls';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private baseUrl = 'https://localhost:5001/api/notification';

  constructor(private http: HttpClient) {}

  getMyNotifications() {
    return this.http.get<any[]>(Notification.getMyNotifications);
  }

  markAsRead(id: number) {
    return this.http.put(Notification.markAsRead(id), {});
  }
}