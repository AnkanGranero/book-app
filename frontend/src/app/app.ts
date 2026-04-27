import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NotificationService } from './services/notification';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  theme = signal<'light' | 'dark'>('light');
  constructor(
    public notification: NotificationService,
    public auth: AuthService,
    private router: Router,
  ) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  toggleTheme() {
    const toggledTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(toggledTheme);
    document.documentElement.setAttribute('data-bs-theme', toggledTheme);
  }
  themeIcon = computed(() =>
    this.theme() === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon bg-white',
  );
}
