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

// mahmoud 33 53

// hossam 54 75

// mustafa 76 96

// Arwa 97 117

// Amr 118 138

// end of file
