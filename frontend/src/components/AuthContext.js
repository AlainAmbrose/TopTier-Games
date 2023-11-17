import React, { createContext, useEffect } from 'react';

export const AuthContext = createContext();

function scheduleTokenRefresh(expiryTimeInSeconds) {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiryTimeInSeconds - currentTimeInSeconds;

    // Set a buffer time, e.g., refresh the token 5 minutes before it expires
    const bufferTime = 5 * 60;
    const refreshTime = Math.max(0, timeUntilExpiry - bufferTime) * 1000;

    setTimeout(() => {
        refreshToken();
    }, refreshTime);
}

async function refreshToken() {
    if (userIsActive) {
        try {
            const response = await fetch('/refresh-token', { method: 'POST', credentials: 'include' });
            if (response.ok) {
                // Optionally, the server can send the new token's expiry time in the response
                const { expiryTime } = await response.json();
                scheduleTokenRefresh(expiryTime);
            } else {
                // Handle refresh failure, e.g., redirect to login
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Handle errors
        }
    } else {
        // Handle user not being active, e.g., redirect to login
    }
}

function setUserActive() {
    userIsActive = true;
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => userIsActive = false, 10 * 60 * 1000); // 10 minutes of inactivity
}

let userIsActive = true;
let inactivityTimeout;

// Event listeners for user actions
window.addEventListener('mousemove', setUserActive);
window.addEventListener('keydown', setUserActive);
window.addEventListener('click', setUserActive);

export const AuthProvider = ({ children }) => {
    useEffect(() => {
        scheduleTokenRefresh();

        return () => {
            // Cleanup logic if needed
        };
    }, []);

    // ... your existing logic for scheduleTokenRefresh and refreshToken

    return <AuthContext.Provider value={{ /* context values */ }}>
        {children}
    </AuthContext.Provider>;
};

export default AuthProvider;