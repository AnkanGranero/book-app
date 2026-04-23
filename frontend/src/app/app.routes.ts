import { Routes } from '@angular/router';
import { Books } from './pages/books/books';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: Books },
];
