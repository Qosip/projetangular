import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { HomeComponent } from './features/home/pages/home';
import { ChatComponent } from './features/chat/pages/chat';
import { LoginComponent } from './features/login/pages/login';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'chat/:id', component: ChatComponent },
    ]
  },
  { path: '**', redirectTo: '' },
];
