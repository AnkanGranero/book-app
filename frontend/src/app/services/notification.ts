import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal('');
  type = signal<'success' | 'error' | ''>('');

  showSuccess(msg: string) {
    this.message.set(msg);
    this.type.set('success');
    this.clearAfterDelay();
  }
  showError(msg: string) {
    this.message.set(msg);
    this.type.set('error');
    this.clearAfterDelay();
  }

  private clearAfterDelay() {
    setTimeout(() => {
      this.message.set('');
      this.type.set('');
    }, 3000);
  }
}
