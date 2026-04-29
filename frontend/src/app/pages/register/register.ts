import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService,
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.notification.showError('Passwords do not match');
      return;
    }

    this.auth.register(this.username.trim(), this.password.trim()).subscribe({
      next: () => {
        this.notification.showSuccess('Account created successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notification.showError(err.error ?? 'Registration failed');
      },
    });
  }
}
