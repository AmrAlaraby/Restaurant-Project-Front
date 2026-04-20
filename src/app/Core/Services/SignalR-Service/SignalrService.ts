import * as signalR from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { signalRUrl } from '../../Constants/Api_Urls';

@Injectable({ providedIn: 'root' })
export class SignalRService {

  private hubConnection!: signalR.HubConnection;

  startNotificationsConnection(token: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl.notifications, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    return this.hubConnection.start();
  }

  startRestaurantUpdatesConnection(token: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl.restaurantUpdates, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    return this.hubConnection.start();
  }

  onNotification(callback: (data: any) => void) {
    this.hubConnection.on('LowStockAlert', callback);
  }

  onRestaurantUpdate(eventName :string,callback: (data: any) => void) {
    this.hubConnection.on(eventName, callback);
  }
}