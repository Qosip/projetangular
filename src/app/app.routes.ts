import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { Home } from './pages/home';
import { Chat } from './pages/chat';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'chat/:id', component: Chat },
    ]
  },
  { path: '**', redirectTo: '' },
];
