const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

export const AUTH_ENDPOINTS = {
    REGISTER:`${BASE_URL}/auth/register`,
    LOGIN:`${BASE_URL}/auth/login`,
}