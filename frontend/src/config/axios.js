import axios from 'axios';
import { verifyTokenIntegrity } from '../utils/tokenValidity';
import { getActiveAuthToken, setActiveAuthToken, clearActiveAuthToken } from '../utils/activeAuthToken';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// ✅ 1. Request Interceptor: Attach Token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = getActiveAuthToken();
    const tokenValid = verifyTokenIntegrity(); // Check if token is locally valid (not expired)

    if (token && tokenValid) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ✅ 2. Response Interceptor: Handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the backend returns 401 (Unauthorized/Expired)
        if (error.response?.status === 401) {

            // Check for security violations first (immediate logout)
            const errorMessage = error.response?.data?.message || '';
            const securityViolations = [
                'Invalid token - role mismatch detected',
                'Invalid token - email mismatch detected',
                'Invalid token - data integrity check failed',
                'Token has been invalidated',
                'Account not verified or not found'
            ];

            const isSecurityViolation = securityViolations.some(v => errorMessage.includes(v));

            if (isSecurityViolation || !originalRequest._retry) {
                console.warn("Session expired or unauthorized. Logging out...");

                // Clear all auth data
                clearActiveAuthToken();
                localStorage.removeItem('user');

                if (window.store) {
                    try {
                        const { logout } = await import('../redux/slice/authSlice');
                        window.store.dispatch(logout());

                        // Show toast message if store is available
                        const { toast } = await import('react-toastify');
                        toast.error(errorMessage || "Session expired. Please login again.");
                    } catch (e) {
                        console.error("Logout dispatch failed:", e);
                    }
                }

                // Redirect after a short delay to allow toast to be seen
                setTimeout(() => {
                    const isAdminPath = window.location.pathname.startsWith("/admin");
                    window.location.href = isAdminPath ? "/login" : "/login";
                }, 1500);

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;