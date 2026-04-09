import { environment } from "../../../environments/environment.development";

const apiUrl = environment.apiUrl;
export const Auth = {
    login: `${apiUrl}/Auth/login`,
    register: `${apiUrl}/Auth/register`,
    refresh: `${apiUrl}/Auth/refresh-token`,
    currentUser: `${apiUrl}/Auth/current-user`,
    UpdatecurrentUser: `${apiUrl}/Auth`,
}