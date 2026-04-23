import { Routes } from '@angular/router';
import { OwnDeliveries } from './Features/driver/components/own-deliveries/own-deliveries';
import { DeliveryDetails } from './Features/driver/components/delivery-details/delivery-details';
import { WaiterLayout } from './Features/waiter/pages/waiter-layout/waiter-layout';

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
        path: 'branch-stock',
        loadComponent: () =>
          import('./Features/admin/pages/branch-stock-page/branch-stock/branch-stock').then(
            (m) => m.BranchStockComponent,
          ),
      },
      {
        path: 'branch',
        loadComponent: () =>
          import('./Features/admin/pages/branch-page/branch-page').then(
            (m) => m.BranchPageComponent,
          ),
      },
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
    path: 'waiter',
    loadComponent: () =>
      import('./Features/waiter/pages/waiter-layout/waiter-layout').then((m) => m.WaiterLayout),
    children: [
      // باقي routes الـ waiter
      //amr 100 -150
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'place-order',
        loadComponent: () =>
          import('./Features/waiter/pages/place-order/place-order').then((m) => m.PlaceOrder),
      },
      {
        path: 'place-order/:tableNumber',
        loadComponent: () =>
          import('./Features/waiter/pages/place-order/place-order').then((m) => m.PlaceOrder),
      },
      //hossam 151 - 200
      {
        path: 'profile',
        loadComponent: () =>
          import('./Features/waiter/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'kitchen',
        loadComponent: () =>
          import('./Features/waiter/pages/kitchen/kitchen').then((m) => m.Kitchen),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./Features/waiter/pages/home/home').then((m) => m.HomeComponent),
      },

      {
        path: 'tables',
        loadComponent: () =>
          import('./Features/waiter/pages/table-waiter/table-waiter').then((m) => m.TableWaiter),
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./Features/waiter/pages/waiter-orders-page/waiter-orders-page').then(
            (m) => m.WaiterOrdersPage,
          ),
      },
      //Areej 201 - 250
      //Arwa 251 - 300
      //mahmoud 301 - 350
      //mustafa 351 - 400
    ],
  },

  //amr 100 -150
  //hossam 151 - 200
  //Areej 201 - 250
  //Arwa 251 - 300
  //mahmoud 301 - 350
  //mustafa 351 - 400

  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('./Features/admin/pages/branch-page/branch-page').then(
  //       (m) => m.BranchPageComponent
  //     ),
  // },

  //amr 100 -150
  //hossam 151 - 200
  //Areej 201 - 250
  //Arwa 251 - 300
  //mahmoud 301 - 350
  //mustafa 351 - 400

  {
    path: 'cashier',
    loadComponent: () =>
      import('./Features/cashier/pages/cashier-layout/cashier-layout').then((m) => m.CashierLayout),
    children: [
      //amr 400 -450
      {
        path: 'create-order',
        loadComponent: () =>
          import('./Features/cashier/pages/create-order/create-order').then((m) => m.CreateOrder),
      },
      //hossam 451 - 500
      {
        path: 'profile',
        loadComponent: () =>
          import('./Features/cashier/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./Features/cashier/pages/cashier-orders-page/cashier-orders-page').then(
            (m) => m.CashierOrdersPage,
          ),
      },
      //Areej 501 - 550
      //Arwa 551 - 600
      //mahmoud 601 - 650
      //mustafa 651 - 700
    ],
  },

  {
    path: 'driver',
    loadComponent: () =>
      import('./Features/driver/pages/driver-layout/driver-layout').then((m) => m.DriverLayout),
    children: [
      //amr 400 -450
      {
        path: 'home',
        loadComponent: () =>
          import('./Features/driver/pages/home-page/home-page').then((m) => m.HomePage),
      },
      //hossam 451 - 500
      {
        path: 'profile',
        loadComponent: () =>
          import('./Features/driver/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'delivery-history',

        loadComponent: () =>
          import('./Features/driver/pages/delivery-history/delivery-history').then(
            (m) => m.DeliveryHistory,
          ),
      },

      {
        path: 'deliveries',
        component: OwnDeliveries,
      },
      {
        path: 'deliveries/:id',
        component: DeliveryDetails,
      },

      //Areej 501 - 550
      //Arwa 551 - 600
      //mahmoud 601 - 650
      //mustafa 651 - 700
    ],
  },
  {
    path: 'chief',
    loadComponent: () =>
      import('./Features/chief/pages/chef-layout/chef-layout').then((m) => m.ChefLayout),
    children: [
      { path: '', redirectTo: 'kitchen', pathMatch: 'full' },
      //amr 400 -450

      //hossam 451 - 500
      {
        path: 'profile',
        loadComponent: () =>
          import('./Features/waiter/pages/profile/profile').then((m) => m.Profile),
      },

      {
        path: 'kitchen',
        loadComponent: () =>
          import('./Features/chief/components/chef-kitchen/chef-kitchen-board/chef-kitchen-board').then(
            (m) => m.ChefKitchenBoardComponent,
          ),
      },
      {
       path: 'recipes',
    loadComponent: () =>
      import('./Features/chief/pages/recipe-page/recipe-page').then(
      (m) => m.RecipeListPage
    ),
  }
      //Areej 501 - 550
      //Arwa 551 - 600
      //mahmoud 601 - 650
      //mustafa 651 - 700
    ],
  },
  {
    path: 'customer',

    children: [
      //amr

      //hossam
      {
        path: 'profile',
        loadComponent: () =>
          import('./Features/customer/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./Features/customer/pages/home-page/home-page').then((m) => m.HomePage),
      },{
        path: 'browse-menu',
        loadComponent: () =>
          import('./Features/customer/pages/browse-menu-page/browse-menu-page').then((m) => m.BrowseMenuPage),
      },
      //Areej
      //Arwa
      //mahmoud
      //mustafa
    ],
  },
];
