import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { AUTH_ENDPOINTS } from '../services/api';
import axios from "axios";

const { REGISTER, LOGIN } = AUTH_ENDPOINTS;


export const registerUser = createAsyncThunk('auth/registerUser', async (credentials, { rejectWithValue }) => {
    const toastId = toast.loading('User is being registered');
    try {
        const name = credentials.name;
        const email = credentials.email;
        const password = credentials.password;
        const confirmPassword = credentials.confirmPassword;

        console.log("credentials", credentials);

        if (!email || !password || !confirmPassword || !name) {
            toast.dismiss(toastId);
            toast.error('Please fill all the required fields');
            return rejectWithValue('Please fill all the required fields');
        }

        if (password !== confirmPassword) {
            toast.dismiss(toastId);
            toast.error('Passwords do not match');
            return rejectWithValue('Please fill all the required fields');
        }

        const response = await axios.post(REGISTER, { ...credentials });

        if (!response?.data?.success) {
            toast.dismiss(toastId);
            toast.error(!response?.data?.success || 'Failed to register user');
            return rejectWithValue('Failed to register user');
        }
        toast.dismiss(toastId);
        toast.success("User registered successfully");
        return response.data;
    } catch (error) {
        console.log(error);
        toast.dismiss(toastId);
        toast.error('Error during registration');
        return rejectWithValue('Error during registration');
    }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    const toastId = toast.loading("Logging In")
    try {
        const response = await axios.post(LOGIN, { ...credentials });

        if (!response?.data?.success) {
            toast.dismiss(toastId)
            toast.error(!response?.data?.success || 'Failed to loggin user');
            return rejectWithValue('Failed to loggin user');
        }
        toast.dismiss(toastId)
        toast.success('Login Success');
        return response.data;
    } catch (error) {
        console.log(error);
        toast.dismiss(toastId)
        toast.error('Error during login');
        return rejectWithValue('Error during login');
    }
});

const getUserFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token") || null;
};

const initialState = {
    user: getUserFromLocalStorage(),
    token: getTokenFromLocalStorage(),
    error: null,
    isLoading: false,
    status: 'idle',
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
            state.error = null;
        })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.status = 'succeed';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload || action.error;
                state.status = 'failed';
                state.isLoading = false;
            });

        builder.addCase(login.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                state.status = 'succeed';
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload || action.error;
                state.status = 'failed';
                state.isLoading = false;
            });
    }
});

export const { setIsLoading, logout } = authSlice.actions;
export default authSlice.reducer;
