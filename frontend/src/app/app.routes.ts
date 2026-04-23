import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: Books },
  { path: 'login', component: Login},
];
