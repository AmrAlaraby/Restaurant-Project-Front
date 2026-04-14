import { Routes } from '@angular/router';

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
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () => import('./Features/admin/pages/layout/layout').then((m) => m.Layout),

    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'orders',
        loadComponent: () =>
          import('./Features/admin/pages/orders-page/orders-page').then((m) => m.OrdersPage),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./Features/admin/components/report/dashboard/dashboard').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'kitchen',
        loadComponent: () =>
          import('./Features/admin/components/Kitchen/kitchen-board/kitchen-board').then(
            (m) => m.KitchenBoardComponent,
          ),
      },
      {
        path: 'tables',
        loadComponent: () =>
          import('./Features/admin/pages/tables-page/tables-page').then((m) => m.TablesPage),
      },
      {
        path: 'deliveries',
        loadComponent: () =>
          import('./Features/admin/pages/delivery-page/delivery-page/delivery-page').then(
            (m) => m.DeliveryPage,
          ),
      },
      {
        path: 'deliveries/:id',
        loadComponent: () =>
          import('./Features/admin/components/Delivery/delivery-details/delivery-details').then(
            (m) => m.DeliveryDetails,
          ),
      },
      {
        path: 'menu-items',
        loadComponent: () =>
          import('./Features/admin/pages/menu-items-page/menu-items-page').then(
            (m) => m.MenuItemsPage,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./Features/admin/pages/categories-page/categories-page').then(
            (m) => m.CategoriesPage,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./Features/admin/pages/users-page/users-page').then((m) => m.UsersPage),
      },
      {
        path: 'ingredients',
        loadComponent: () =>
          import('./Features/admin/components/Ingredient/ingredients/ingredients').then(
            (m) => m.IngredientsComponent,
          ),
      },
    ],
  },

  {
    path: 'waiter', // أو admin أو cashier
    children: [
      // باقي routes الـ waiter
      //amr 100 -150
      {
    path: 'place-order',
    loadComponent: () =>
      import('./Features/waiter/pages/place-order/place-order')
        .then(m => m.PlaceOrder)
  },
  {
    path: 'place-order/:tableNumber',
    loadComponent: () =>
      import('./Features/waiter/pages/place-order/place-order')
        .then(m => m.PlaceOrder)
  },
      //hossam 151 - 200
      {
        path: 'profile',
        loadComponent: () =>
          import('./Features/waiter/pages/profile/profile').then((m) => m.Profile),
      },
      //Areej 201 - 250
      //Arwa 251 - 300
      //mahmoud 301 - 350
      //mustafa 351 - 400
    ],
  },
];
