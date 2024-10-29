const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

export const AUTH_ENDPOINTS = {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT_USER:`${BASE_URL}/auth/logout`
}

export const TASK_ENDPOINTS = {
    CREATE_TASK: `${BASE_URL}/tasks/create`,
    GET_ALL_TASKS: `${BASE_URL}/tasks`,
    GET_TASK_DETAILS: (id) => `${BASE_URL}/tasks/${id}`,
    UPDATE_TASK: (id) => `${BASE_URL}/tasks/update/${id}`,
    DELETE_TASK: (id) => `${BASE_URL}/tasks/delete/${id}`,
    UPDATE_CATEGORY:(id)=>`${BASE_URL}/tasks/update/${id}/category`,
    ANALYTICS:`${BASE_URL}/tasks/analytics`,
}

export const USER_ENDPOINTS = {
    GET_ALL_USERS:`${BASE_URL}/users`,
    ADD_PEOPLE:`${BASE_URL}/users/add-people`,
    UPDATE_USER:`${BASE_URL}/users/update`,
}