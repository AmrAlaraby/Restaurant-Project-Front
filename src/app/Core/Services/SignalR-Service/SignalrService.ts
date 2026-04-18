import * as signalR from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { signalRUrl } from '../../Constants/Api_Urls';

@Injectable({ providedIn: 'root' })
export class SignalRService {

  private hubConnection!: signalR.HubConnection;

  startConnection(token: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl.notifications, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    return this.hubConnection.start();
  }

  onNotification(callback: (data: any) => void) {
    this.hubConnection.on('LowStockAlert', callback);
  }
}