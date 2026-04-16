import { environment } from '../../../environments/environment.development';

const apiUrl = environment.apiUrl;
export const Auth = {
  login: `${apiUrl}/Auth/login`,
  register: `${apiUrl}/Auth/register`,
  refresh: `${apiUrl}/Auth/refresh-token`,
  currentUser: `${apiUrl}/Auth/CurrentUser`,
  UpdatecurrentUser: `${apiUrl}/Auth`,
};

// areej 12 32
export const Tables = {
  getAll: `${apiUrl}/Table`,
  getById: (id: number) => `${apiUrl}/Table/${id}`,
  create: `${apiUrl}/Table`,
  update: (id: number) => `${apiUrl}/Table/${id}`,
  updateStatus: (id: number) => `${apiUrl}/Table/${id}/status`,
  delete: (id: number) => `${apiUrl}/Table/${id}`,
};

export const TableOrders = {
  getAll: `${apiUrl}/TableOrders`,
  create: `${apiUrl}/TableOrders`,
  complete: (id: number) => `${apiUrl}/TableOrders/${id}/complete`,
};

// mahmoud 33 53
export const MenuItems = {
  getAll: `${apiUrl}/MenuItems`,
  create: `${apiUrl}/MenuItems`,
  getById: (id: number) => `${apiUrl}/MenuItems/${id}`,
  update: (id: number) => `${apiUrl}/MenuItems/${id}`,
  delete: (id: number) => `${apiUrl}/MenuItems/${id}`,
  toggleAvailability: (id: number) => `${apiUrl}/MenuItems/${id}/toggle-availability`,
};

export const Users = {
  getAll: `${apiUrl}/User`,
  getById: (id: string) => `${apiUrl}/User/${id}`,
  getInactive: `${apiUrl}/User/inactive`,
  getRoles: `${apiUrl}/User/Roles`,
  create: `${apiUrl}/User`,
  update: (id: string) => `${apiUrl}/User/${id}`,
  toggle: (id: string) => `${apiUrl}/User/${id}/toggle-status`,

  searchCustomers: `${apiUrl}/User/GetAllCustomerUserAysnc`,
  addCustomer: `${apiUrl}/User/AddCustomerAsync`,
  updateCustomerAddress: (id: string) => `${apiUrl}/User/${id}/address`
};






// hossam 54 75




















export const Categories = {
  base: `${apiUrl}/Categories`,
  getAll: `${apiUrl}/Categories`,
  getById: (id: number) => `${apiUrl}/Categories/${id}`,
  create: `${apiUrl}/Categories`,
  update: (id: number) => `${apiUrl}/Categories/${id}`,
  delete: (id: number) => `${apiUrl}/Categories/${id}`,
};

// mustafa 76 96
export const Kitchen = {
  board: `${apiUrl}/Kitchen/KitchenTickets`,
  ticket: (id: number) => `${apiUrl}/Kitchen/${id}`,
  activeStations: `${apiUrl}/Kitchen/ActiveStations`,
  updateStatus: (id: number) => `${apiUrl}/Kitchen/${id}`,
};

export const Branch = {
  getAll: `${apiUrl}/Branch`,
  getAllWithTables: `${apiUrl}/Branch/GetAllBranchesWithTables`,
  getById: (id: number) => `${apiUrl}/Branch/${id}`,
  create: `${apiUrl}/Branch`,
  update: (id: number) => `${apiUrl}/Branch/${id}`,
  delete: (id: number) => `${apiUrl}/Branch/${id}`,
  toggleStatus: (id: number) => `${apiUrl}/Branch/${id}/toggle-status`,
};


export const Deliveries = {
  getAll: `${apiUrl}/Delivery/GetAll`,
  unassigned: `${apiUrl}/Delivery/unassigned`,
  ownAssigned: `${apiUrl}/Delivery/OwnAssignedDeliveries`,
  getById: `${apiUrl}/Delivery/DeliveryById`,
  assign: `${apiUrl}/Delivery/assign`,
  updateStatus: (id: number) => `${apiUrl}/Delivery/${id}/status`,
  availableDrivers: `${apiUrl}/Delivery/available-drivers`,
};










// Arwa 97 117

export const Ingredients = {
  getAll: `${apiUrl}/Ingredients`,
  getById: (id: number) => `${apiUrl}/Ingredients/${id}`,
  create: `${apiUrl}/Ingredients`,
  update: (id: number) => `${apiUrl}/Ingredients/${id}`,
  delete: (id: number) => `${apiUrl}/Ingredients/${id}`,
};
export const BranchStock = {
  getAll: `${apiUrl}/BranchStock`,
  getById: (id: number) => `${apiUrl}/BranchStock/${id}`,
  update: (id: number) => `${apiUrl}/BranchStock/${id}`,
};











// Amr 118 138
export const Order = {
  create: `${apiUrl}/Order`,
  getAll: `${apiUrl}/Order`,
  getById: (id: number) => `${apiUrl}/Order/${id}`,
  myOrders: `${apiUrl}/Order/my`,
  updateStatus: (orderId: number) => `${apiUrl}/Order/${orderId}/status`,
  addItems: (orderId: number) => `${apiUrl}/Order/${orderId}/items`,
  removeItem: (orderId: number, itemId: number) => `${apiUrl}/Order/${orderId}/items/${itemId}`,
  cancel: (orderId: number) => `${apiUrl}/Order/${orderId}/cancel`,
};

// end of file
