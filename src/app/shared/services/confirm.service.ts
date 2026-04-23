import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  isOpen = signal(false);
  options = signal<ConfirmOptions>({ title: '' });
  private resolveCallback?: (value: boolean) => void;

  open(options: ConfirmOptions): Promise<boolean> {
    this.options.set({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'danger',
      ...options
    });
    this.isOpen.set(true);
    return new Promise(resolve => {
      this.resolveCallback = resolve;
    });
  }

  confirm() {
    this.isOpen.set(false);
    this.resolveCallback?.(true);
  }

  cancel() {
    this.isOpen.set(false);
    this.resolveCallback?.(false);
  }
}
