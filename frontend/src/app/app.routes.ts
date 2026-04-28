import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';
import { Quotes } from './pages/quotes/quotes';


export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: Books, canActivate: [authGuard] },
  { path: 'login', component: Login},
  {path: 'register', component: Register},
  {path: 'quotes', component: Quotes, canActivate: [authGuard]}
];
