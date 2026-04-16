export type ToastType = 'success' | 'error';

export interface ToastInterface {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}