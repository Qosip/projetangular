import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { HomeComponent } from './pages/home.component';
import { ChatComponent } from './pages/chat.component';
import { LoginComponent } from './pages/login.component';
import { authGuard } from './services/auth.guard';

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
