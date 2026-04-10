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
  path: "tables",
  loadComponent: () => import('./Features/tables/pages/tables/tables-component/tables-component').then(m => m.TablesComponent)
},
  {
    path: "",
    redirectTo: "tables",
    pathMatch: "full"
  }

];
