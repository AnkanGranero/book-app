import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  imports: [FormsModule],
})
export class Login {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService,
  ) {}

  onSubmit() {
    const username = this.username.trim();
    const password = this.password.trim();

    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);

        this.notification.showSuccess('Logged in successfully');

        this.router.navigate(['./books']);
      },
      error: () => {
        this.notification.showError('Invalid username or password');
      },
    });
  }
}
