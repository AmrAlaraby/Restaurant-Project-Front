import { Component } from '@angular/core';
import { ToastService } from '../../../Core/Services/Toast-Service/toast-service';
import { CommonModule } from '@angular/common';
import { ToastInterface } from '../../../Core/Models/SharedModels/toast';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  toasts: ToastInterface[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe(t => {
      this.toasts = t;
    });
  }

  close(id: number) {
    this.toastService.remove(id);
  }
}
