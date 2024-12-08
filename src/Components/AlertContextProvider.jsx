// AlertContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

const AlertContext = createContext({
    alert: { message: '', type: 'warning', show: false },
    showAlert: (message, type) => { message; type; },
    hideAlert: () => { },
    showWarning: (message) => { message; },
    showSuccess: (message) => { message; },
    showError: (message) => { message; }
});

export const useAlert = () => {
    return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ message: '', type: '', show: false });

    const showWarning = (message) => {
        setAlert({ message, type: 'warning', show: true });
        autoCloseAlert();
    };

    const showSuccess = (message) => {
        setAlert({ message, type: 'success', show: true });
        autoCloseAlert();
    };

    const showError = (message) => {
        setAlert({ message, type: 'error', show: true });
        autoCloseAlert();
    };

    const showAlert = (message, type) => {
        setAlert({ message, type, show: true });
        autoCloseAlert();
    };

    const hideAlert = () => {
        setAlert({ ...alert, show: false });
    };

    const deboucer = useCallback((func, delay) => {
        let timer = null;
        return function () {
            if (timer !== null)
                clearTimeout(timer);
            timer = setTimeout(() => {
                func();
            }, delay);
        };
    }, []);

    const autoCloseAlert = useCallback(deboucer(() => {
        hideAlert();
    }, 5000), []);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert, showWarning, showSuccess, showError }}>
            {children}
        </AlertContext.Provider>
    );
};
