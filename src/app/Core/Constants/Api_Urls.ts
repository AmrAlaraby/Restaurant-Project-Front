import { environment } from '../../../environments/environment.development';

const apiUrl = environment.apiUrl;
export const Auth = {
  login: `${apiUrl}/Auth/login`,
  register: `${apiUrl}/Auth/register`,
  refresh: `${apiUrl}/Auth/refresh-token`,
  currentUser: `${apiUrl}/Auth/current-user`,
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

export const Ingredients = {
  getAll: `${apiUrl}/Ingredients`,
};

export const Categories = {
  getAll: `${apiUrl}/Categories`,
};




// hossam 54 75



























// mustafa 76 96
export const Kitchen = {
  board: `${apiUrl}/Kitchen/KitchenTickets`,
  ticket: (id: number) => `${apiUrl}/Kitchen/${id}`,
  activeStations: `${apiUrl}/Kitchen/ActiveStations`,
  updateStatus: (id: number) => `${apiUrl}/Kitchen/${id}`,
};


























// Arwa 97 117

// Amr 118 138

// end of file
