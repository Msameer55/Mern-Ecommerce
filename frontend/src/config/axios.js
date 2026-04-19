import axios from 'axios';
import { verifyTokenIntegrity } from '../utils/tokenValidity';
import { getActiveAuthToken, setActiveAuthToken, clearActiveAuthToken } from '../utils/activeAuthToken';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// Add a request interceptor this takes the latest token in the headers everytime it is called
axiosInstance.interceptors.request.use((config) => {
    const token = getActiveAuthToken();
    const tokenValid = verifyTokenIntegrity()
    if (token && tokenValid) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle token refresh and security violations
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // SECURITY: Handle token manipulation and security violations immediately
        if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.message || '';

            // Check for security violations that require immediate logout
            const securityViolations = [
                'Invalid token - role mismatch detected',
                'Invalid token - email mismatch detected',
                'Invalid token - data integrity check failed',
                'Token has been invalidated',
                'Account not verified or not found'
            ];

            const isSecurityViolation = securityViolations.some(violation =>
                errorMessage.includes(violation)
            );

            if (isSecurityViolation) {
                console.error('SECURITY VIOLATION DETECTED:', errorMessage);

                // Immediately clear all auth data
                clearActiveAuthToken();
                localStorage.removeItem('lastServerValidation');

                // Dispatch logout action if store is available
                if (window.store) {
                    try {
                        const { logout } = await import('../redux/slice/authSlice');
                        window.store.dispatch(logout());
                    } catch (e) {
                        console.error('Failed to dispatch logout:', e);
                    }
                }

                // Force redirect to login page
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Check if the error is due to token requiring refresh (non-security related)
            if (error.response?.data?.requiresRefresh && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Call refresh token endpoint
                    const refreshResponse = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${getActiveAuthToken()}`
                            }
                        }
                    );

                    // Update token in localStorage
                    const newToken = refreshResponse.data.token;
                    setActiveAuthToken(newToken);

                    // Update the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Dispatch refresh token action to update Redux store
                    if (window.store) {
                        const { refreshToken } = await import('../redux/slice/authSlice');
                        window.store.dispatch(refreshToken());
                    }

                    // Retry the original request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    clearActiveAuthToken();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

        }

        return Promise.reject(error);
    }
);

export default axiosInstance;