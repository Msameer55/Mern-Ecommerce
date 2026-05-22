import { jwtDecode } from 'jwt-decode';
import { clearImpersonationToken, getActiveAuthToken, getImpersonationToken } from './activeAuthToken';

// Creating Guest Id 
export const getOrCreateGuestId = () => {
    const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
    localStorage.setItem("guestId", initialGuestId);
    return initialGuestId;
}

const clearActiveToken = () => {
    // Prefer clearing tab-scoped impersonation token (so we don't kick the admin out everywhere)
    if (getImpersonationToken()) {
        clearImpersonationToken();
        return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const isTokenValid = (token) => {
    try {
        if (!token) {
            return {
                valid: false,
                user: null,
                role: null,
                otpVerified: false,
                email: null,
                publicRoute: true
            };
        }

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token is expired
        if (decoded.exp <= currentTime) {
            clearActiveToken();
            return {
                valid: false,
                user: null,
                role: null,
                otpVerified: false,
                email: null,
            };
        }

        // Basic token structure validation
        if (!decoded.id || !decoded.role || !decoded.email) {
            console.error('SECURITY WARNING: Token missing required fields');
            clearActiveToken();
            return {
                valid: false,
                user: null,
                role: null,
                otpVerified: false,
                email: null,
            };
        }

        // Validate role values
        const validRoles = ['customer', 'admin'];
        if (!validRoles.includes(decoded.role)) {
            console.error('SECURITY WARNING: Invalid role detected in token');
            clearActiveToken();
            return {
                valid: false,
                user: null,
                role: null,
                otpVerified: false,
                email: null,
            };
        }
        // Return the token's validity and update fields from the token payload
        return {
            valid: true,
            user: decoded.user || { id: decoded.id, email: decoded.email, role: decoded.role },
            role: decoded.role || null,
            email: decoded.email || null,
            otpVerified: true,

        };

    } catch (error) {
        console.error('Token validation error:', error.message);
        clearActiveToken();

        return {
            valid: false,
            user: null,
            role: null,
            otpVerified: false,
            email: null,
        };
    }
};

// Verify token integrity before API calls
export const verifyTokenIntegrity = () => {
    const token = getActiveAuthToken();
    const tokenData = isTokenValid(token);

    if (tokenData.publicRoute) {
        return true;
    }

    if (!tokenData.valid) {
        // We no longer redirect here to avoid blank pages/interruptions.
        // The axios interceptor will handle the 401 from the server or 
        // the missing token and then redirect smoothly.
        return false;
    }

    return true;
};

// Detect potential token manipulation
// This function checks for various forms of JWT token tampering including:
// - Role manipulation (changing user role)
// - Email manipulation (changing user email)
// - Token structure tampering
// - Artificially constructed tokens
export const detectTokenManipulation = () => {
    const token = getActiveAuthToken();

    if (!token) return false;

    try {
        const decoded = jwtDecode(token);

        // Check for basic token structure issues
        const suspiciousChanges = [
            !decoded.iat || !decoded.exp,
            typeof decoded.role !== 'string',
            typeof decoded.email !== 'string',
            !decoded.id || typeof decoded.id !== 'string'
        ];

        // Check for artificially constructed tokens
        if (detectArtificialTokenConstruction(decoded)) {
            console.error('SECURITY ALERT: Artificially constructed token detected');
            clearActiveToken();
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token manipulation detection error:', error);
        clearActiveToken();
        return true;
    }
};


// Helper function to detect artificially constructed tokens
const detectArtificialTokenConstruction = (decoded) => {
    // Check if issued-at time is suspiciously recent
    // if (decoded.iat && (Date.now() / 1000 - decoded.iat) < 0.1) {
    //   return true;
    // }

    // Validate sessionVersion if present
    if (decoded.sessionVersion && typeof decoded.sessionVersion !== 'number') {
        return true;
    }

    // Basic email validation
    if (decoded.email && !decoded.email.includes('@')) {
        return true;
    }

    // Enhanced email validation
    if (decoded.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(decoded.email)) {
            return true;
        }
    }

    // Basic ID validation
    if (decoded.id) {
        if (typeof decoded.id !== 'string' || decoded.id.length < 10) {
            return true;
        }
    }

    return false;
};