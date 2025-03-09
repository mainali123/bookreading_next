import {environment} from "@/constants/environment";
import axios from "axios";
import {LoginFormTypeDTO, loginRes} from "@/types/login";
import {toast} from "sonner";

const api = axios.create({
    baseURL: environment.API_URL,
    withCredentials: true,
})

// Auto-refresh token when expired
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const {data} = await api.post('/refresh');

                sessionStorage.setItem('authToken', data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

                error.config.headers.Authorization = `Bearer ${data.access_token}`;
                return api.request(error.config);
            } catch (refreshError) {
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

// Auto-refresh user session when page regains focus
export const setupAutoReAuth = () => {
    const fetchUser = async () => {
        try {
            const { data } = await api.get('/me');
            sessionStorage.setItem('user', JSON.stringify(data));
        } catch {
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');
        }
    };

    window.addEventListener('focus', fetchUser);
    return () => window.removeEventListener('focus', fetchUser);
};

const saveAuthData = (data: loginRes) => {
    sessionStorage.setItem('authToken', data.token);

    if (data.user) {
        const safeUserData = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar: data.user.avatar,
        }
        sessionStorage.setItem('user', JSON.stringify(safeUserData));
    }

    // TODO: SET EXPIRATION

    api.defaults.headers.common['Authorization'] = `${data.tokenType || 'Bearer'} ${data.token}`;
}

export const isAuthenticated = () => {
    return !!sessionStorage.getItem('authToken');
}

export const getCurrentUser = () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export async function loginUser(credentials: LoginFormTypeDTO) {
    try {
        const response = await api.post("/login", credentials);

        if (!response.data.token) {
            toast.error("Invalid credentials");
            return {success: false, error: "Authentication failed"} // TODO: HANDLE ERROR
        }

        saveAuthData(response.data);

        // await
    } catch (error: any) {
        const errorMesasge = error.response?.status === 401
            ? "Invalid credentials"
            : "Failed to authenticate. Please try again.";

        toast.error(errorMesasge);
        return {success: false, error: errorMesasge}
    }
}

export async function logoutUser() {
    try {
        await api.post("/logout");

        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];

        return {success: true};
    } catch (_error) {
        // Force logout
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];

        return {
            success: false,
            error: "Logout from server failed, but local session was cleared"
        };
    }
}