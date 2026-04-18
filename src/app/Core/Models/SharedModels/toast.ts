export type ToastType = 'success' | 'error' | 'warning' | 'notification';

export interface ToastInterface {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}