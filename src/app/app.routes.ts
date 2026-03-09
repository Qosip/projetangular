import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { Home } from './pages/home';
import { Chat } from './pages/chat';
import { Login } from './pages/login';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Home },
      { path: 'chat/:id', component: Chat },
    ]
  },
  { path: '**', redirectTo: '' },
];
