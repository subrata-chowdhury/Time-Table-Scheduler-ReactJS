// AlertContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

interface AlertProviderProps {
    children: React.ReactNode;
}

const AlertContext = createContext({
    alert: { message: '', type: 'warning', show: false },
    showAlert: (message: string, type: string) => { message; type },
    hideAlert: () => { },
    showWarning: (message: string) => { message },
    showSuccess: (message: string) => { message },
    showError: (message: string) => { message }
});

export const useAlert = () => {
    return useContext(AlertContext);
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alert, setAlert] = useState<{ message: string, type: string, show: boolean }>({ message: '', type: '', show: false });

    const showWarning = (message: string) => {
        setAlert({ message, type: 'warning', show: true });
        autoCloseAlert();
    };

    const showSuccess = (message: string) => {
        setAlert({ message, type: 'success', show: true });
        autoCloseAlert();
    }

    const showError = (message: string) => {
        setAlert({ message, type: 'error', show: true });
        autoCloseAlert();
    }

    const showAlert = (message: string, type: string) => {
        setAlert({ message, type, show: true });
        autoCloseAlert();
    };

    const hideAlert = () => {
        setAlert({ ...alert, show: false });
    };

    const deboucer = useCallback((func: () => void, delay: number) => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        return function () {
            if (timer !== null) clearTimeout(timer);
            timer = setTimeout(() => {
                func();
            }, delay);
        }
    }, [])

    const autoCloseAlert = useCallback(deboucer(() => {
        hideAlert();
    }, 5000), []);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert, showWarning, showSuccess, showError }}>
            {children}
        </AlertContext.Provider>
    );
};