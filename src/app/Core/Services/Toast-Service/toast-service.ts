import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastType } from '../../Models/SharedModels/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private counter = 0;


  show(message: string, type: ToastType = 'success', duration = 3000) {

    const toast: Toast = {
      id: ++this.counter,
      message,
      type,
      duration
    };

    const current = this.toastsSubject.value;

    this.toastsSubject.next([...current, toast]);

    // 🔥 auto remove
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }


  remove(id: number) {

    const filtered = this.toastsSubject.value.filter(t => t.id !== id);

    this.toastsSubject.next(filtered);
  }


  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

}
