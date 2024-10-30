// ConfirmContext.js
import React, { createContext, useState, useContext } from 'react';

interface ConfirmProviderProps {
    children: React.ReactNode;
}

const ConfirmContext = createContext({
    confirm: { message: '', type: 'warning', show: false, onApprove: () => { }, onDecline: () => { } },
    showConfirm: (message: string, type: string, onApprove?: () => void, onDecline?: () => void) => { 
        message; 
        type; 
        onApprove;
        onDecline 
    },
    hideConfirm: () => { },
    showWarningConfirm: (message: string, onApprove?: () => void, onDecline?: () => void) => { message; onApprove; onDecline },
    showSuccessConfirm: (message: string, onApprove?: () => void, onDecline?: () => void) => { message; onApprove; onDecline },
    showErrorConfirm: (message: string, onApprove?: () => void, onDecline?: () => void) => { message; onApprove; onDecline },
});

export const useConfirm = () => {
    return useContext(ConfirmContext);
};

type Confirm = {
    message: string,
    type: string,
    show: boolean,
    onApprove: () => void,
    onDecline: () => void
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
    const [confirm, setConfirm] = useState<Confirm>({ message: '', type: '', show: false, onApprove: () => { }, onDecline: () => { } });

    const showWarningConfirm = (message: string, onApprove: () => void = () => { }, onDecline: () => void = () => { }) => {
        setConfirm({ message, type: 'warning', show: true, onApprove, onDecline });
    };

    const showSuccessConfirm = (message: string, onApprove: () => void = () => { }, onDecline: () => void = () => { }) => {
        setConfirm({ message, type: 'success', show: true, onApprove, onDecline });
    }

    const showErrorConfirm = (message: string, onApprove: () => void = () => { }, onDecline: () => void = () => { }) => {
        setConfirm({ message, type: 'error', show: true, onApprove, onDecline });
    }

    const showConfirm = (message: string, type: string, onApprove: () => void = () => { }, onDecline: () => void = () => { }) => {
        setConfirm({ message, type, show: true, onApprove, onDecline });
    };

    const hideConfirm = () => {
        setConfirm({ ...confirm, show: false });
    };

    return (
        <ConfirmContext.Provider value={{ confirm, showConfirm, hideConfirm, showWarningConfirm, showSuccessConfirm, showErrorConfirm }}>
            {children}
        </ConfirmContext.Provider>
    );
};