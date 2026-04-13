import { Routes } from '@angular/router';
import { CategoriesPage } from './Features/admin/pages/categories-page/categories-page';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./Features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./Features/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./Features/tables/pages/tables/tables-component/tables-component').then(
        (m) => m.TablesComponent,
      ),
  },
  {
    path: 'kitchen',
    loadComponent: () =>
      import('./Features/Kitchen/kitchen-board/kitchen-board').then((m) => m.KitchenBoardComponent),
  },

  {
    path: 'register',
    loadComponent: () => import('./Features/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./Features/report/pages/dashboard/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: 'ingredients',
    loadComponent: () =>
      import('./Features/Ingredient/ingredients/ingredients').then((m) => m.IngredientsComponent),
  },

  {
    path: '',
    redirectTo: 'tables',
    pathMatch: 'full',
  },
  {
    path: 'admin/menu-items',
    loadComponent: () =>
      import('./Features/admin/pages/menu-items/menu-items-page/menu-items-page').then(
        (m) => m.MenuItemsPage,
      ),
  },
  {
    path: 'admin/menu-items/create',
    loadComponent: () =>
      import('./Features/admin/pages/menu-items/menu-item-form/menu-item-form').then(
        (m) => m.MenuItemForm,
      ),
  },
  {
    path: 'admin/menu-items/edit/:id',
    loadComponent: () =>
      import('./Features/admin/pages/menu-items/menu-item-form/menu-item-form').then(
        (m) => m.MenuItemForm,
      ),
  },
  //   {
  //   path: 'admin/orders',
  //   loadComponent: () =>
  //     import('./Features/admin/pages/orders-page/orders-page').then(
  //       (m) => m.OrdersPage,
  //     ),
  // },
  {
    path: 'admin',
    loadComponent: () => import('./Features/admin/pages/layout/layout').then((m) => m.Layout),

    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', loadComponent: () => import('./Features/admin/pages/orders-page/orders-page').then(m => m.OrdersPage) },
    ]
  },



























  
{
  path: 'admin/deliveries',
  loadComponent: () =>
    import('./Features/admin/pages/delivery-page/delivery-page/delivery-page')
      .then(m => m.DeliveryPage)
},
{
  path: 'deliveries/:id',
  loadComponent: () =>
    import('./Features/admin/components/Delivery/delivery-details/delivery-details')
      .then(m => m.DeliveryDetails)
}
      {
        path: 'orders',
        loadComponent: () =>
          import('./Features/admin/pages/orders-page/orders-page').then((m) => m.OrdersPage),
      },
    ],
  },
  {
    path: 'admin/categories',
    loadComponent: () =>
      import('./Features/admin/pages/categories-page/categories-page').then(
        (m) => m.CategoriesPage,
      ),
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./Features/admin/pages/users-page/users-page').then((m) => m.UsersPage),
  },
];
