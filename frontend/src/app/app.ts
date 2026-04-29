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
  private getInitialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  theme = signal<'light' | 'dark'>(this.getInitialTheme());
  constructor(
    public notification: NotificationService,
    public auth: AuthService,
    private router: Router,
  ) {
    document.documentElement.setAttribute('data-bs-theme', this.theme());
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  toggleTheme() {
    const toggledTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(toggledTheme);
    document.documentElement.setAttribute('data-bs-theme', toggledTheme);
    localStorage.setItem('theme', toggledTheme);
  }
  themeIcon = computed(() =>
    this.theme() === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon bg-white',
  );
}
