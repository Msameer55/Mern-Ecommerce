// Tab-scoped impersonation token support:
// - localStorage token: normal login (shared across tabs)
// - sessionStorage impersonationToken: "view as borrower" session (tab-specific)

export const IMPERSONATION_TOKEN_KEY = 'impersonationToken';

export const getImpersonationToken = () => {
    try {
        return sessionStorage.getItem(IMPERSONATION_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const setImpersonationToken = (token) => {
    try {
        sessionStorage.setItem(IMPERSONATION_TOKEN_KEY, token);
    } catch {
        // ignore
    }
};

export const clearImpersonationToken = () => {
    try {
        sessionStorage.removeItem(IMPERSONATION_TOKEN_KEY);
    } catch {
        // ignore
    }
};

export const getActiveAuthToken = () => {
    return getImpersonationToken() || localStorage.getItem('token');
};

export const setActiveAuthToken = (token) => {
    if (!token) return;
    // If this tab is impersonating, keep token updates tab-scoped.
    if (getImpersonationToken()) {
        setImpersonationToken(token);
        return;
    }
    localStorage.setItem('token', token);
};

export const clearActiveAuthToken = () => {
    if (getImpersonationToken()) {
        clearImpersonationToken();
        return;
    }
    localStorage.removeItem('token');
};
