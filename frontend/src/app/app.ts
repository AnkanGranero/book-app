import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  theme = signal<'light' | 'dark'>('light');
  constructor(public notification: NotificationService) {}

  toggleTheme() {
    const toggledTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(toggledTheme);
    document.documentElement.setAttribute('data-bs-theme', toggledTheme);
  }
  themeIcon = computed(() => (this.theme() === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon bg-white'));
}
