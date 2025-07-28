import { jwtDecode } from 'jwt-decode';

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const getToken = () => {
    return getAuthToken();
};

export const saveToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const logOut = () => {
    localStorage.removeItem('authToken');
};

export const isTokenValid = () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        console.error("Invalid token", error);
        return false;
    }
};

export const isUserAdmin = () => {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const isExpired = decoded.exp <= currentTime;

        if (isExpired) return false;

        const authorities = decoded.authorities || [];
        return authorities.includes("ROLE_ADMIN");
    } catch (error) {
        console.error("Failed to decode or validate token", error);
        return false;
    }
};