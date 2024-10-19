const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

export const AUTH_ENDPOINTS = {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
}

export const TASK_ENDPOINTS = {
    CREATE_TASK: `${BASE_URL}/tasks/create`,
    GET_ALL_TASKS: `${BASE_URL}/tasks`,
    GET_TASK_DETAILS: (id) => `${BASE_URL}/tasks/${id}`,
    UPDATE_TASK: (id) => `${BASE_URL}/tasks/update/${id}`,
    DELETE_TASK: (id) => `${BASE_URL}/tasks/delete/${id}`,
}