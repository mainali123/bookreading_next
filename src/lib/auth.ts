"use client"

import {environment} from "@/constants/environment";
import axios from "axios";
import {LoginFormTypeDTO, loginRes} from "@/types/login";
import {toast} from "sonner";
import {RegisterFormTypeDTO} from "@/types/register";
import {useAuthStore} from '@/store/auth-store';

export const api = axios.create({
    baseURL: environment.API_URL,
    withCredentials: true,
})

export const csrfAxios = axios.create({
    baseURL: environment.BACKEND_URL,
    withCredentials: true,
});

api.interceptors.request.use(async function (config) {
    try {
        await csrfAxios.get('sanctum/csrf-cookie');

        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
        }
    } catch (error) {
        console.error("Failed to get CSRF token", error);
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

// Setup auth token for API requests
api.interceptors.request.use(function (config) {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

const saveAuthData = (data: loginRes) => {
    useAuthStore.getState().setAuth(data);

    api.defaults.headers.common['Authorization'] = `${data.tokenType || 'Bearer'} ${data.token}`;
}

export const isAuthenticated = () => {
    return useAuthStore.getState().isAuthenticated;
}

export const getCurrentUser = () => {
    return useAuthStore.getState().user;
}

export async function loginUser(credentials: LoginFormTypeDTO) {
    try {
        const {data: response} = await api.post("/login", credentials);

        if (!response.data.token) {
            toast.error("Invalid credentials");
            return {success: false, error: "Authentication failed"}
        }

        saveAuthData(response.data);
        return {success: true};

    } catch (error: unknown) {
        console.log(error);
        const errorMessage = axios.isAxiosError(error) && error.response?.status === 401
            ? "Invalid credentials"
            : "Failed to authenticate. Please try again.";

        toast.error(errorMessage);
        return {success: false, error: errorMessage}
    }
}

export async function registerUser(credentials: RegisterFormTypeDTO) {
    try {
        const response = await api.post("/register", credentials);

        if (!response.data.token) {
            toast.error("Invalid credentials");
            return {success: false, error: "Authentication failed"}
        }

        saveAuthData(response.data);
        return {success: true};

    } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error) && error.response?.status === 401
            ? "Invalid credentials"
            : "Failed to authenticate. Please try again.";

        toast.error(errorMessage);
        return {success: false, error: errorMessage}
    }
}

export async function logoutUser() {
    try {
        await api.post("/logout");

        // Clear Zustand store instead of sessionStorage
        useAuthStore.getState().clearAuth();
        delete api.defaults.headers.common['Authorization'];

        return {success: true};
    } catch (error) {
        // Force logout even if API call fails
        useAuthStore.getState().clearAuth();
        delete api.defaults.headers.common['Authorization'];

        return {
            success: false,
            error: "Logout from server failed, but local session was cleared"
        };
    }
}