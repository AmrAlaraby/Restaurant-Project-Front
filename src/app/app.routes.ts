import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: "login",
    loadComponent: () => import('./Features/auth/pages/login/login').then(m => m.Login)                            
  },
  {
    path: "register",
    loadComponent: () => import('./Features/auth/pages/register/register').then(m => m.Register)
  },
  {
    path: "dashboard",
    loadComponent: () => import('./Features/report/pages/dashboard/dashboard').then(m => m.DashboardComponent)
  }

];
