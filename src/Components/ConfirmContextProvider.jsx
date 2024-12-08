// ConfirmContext.js
import React, { createContext, useState, useContext } from 'react';

const ConfirmContext = createContext({
    confirm: { message: '', type: 'warning', show: false, onApprove: () => { }, onDecline: () => { } },
    showConfirm: (message, type, onApprove, onDecline) => {
        message;
        type;
        onApprove;
        onDecline;
    },
    hideConfirm: () => { },
    showWarningConfirm: (message, onApprove, onDecline) => { message; onApprove; onDecline; },
    showSuccessConfirm: (message, onApprove, onDecline) => { message; onApprove; onDecline; },
    showErrorConfirm: (message, onApprove, onDecline) => { message; onApprove; onDecline; },
});

export const useConfirm = () => {
    return useContext(ConfirmContext);
};

export const ConfirmProvider = ({ children }) => {
    const [confirm, setConfirm] = useState({ message: '', type: '', show: false, onApprove: () => { }, onDecline: () => { } });

    const showWarningConfirm = (message, onApprove = () => { }, onDecline = () => { }) => {
        setConfirm({ message, type: 'warning', show: true, onApprove, onDecline });
    };

    const showSuccessConfirm = (message, onApprove = () => { }, onDecline = () => { }) => {
        setConfirm({ message, type: 'success', show: true, onApprove, onDecline });
    };

    const showErrorConfirm = (message, onApprove = () => { }, onDecline = () => { }) => {
        setConfirm({ message, type: 'error', show: true, onApprove, onDecline });
    };

    const showConfirm = (message, type, onApprove = () => { }, onDecline = () => { }) => {
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
