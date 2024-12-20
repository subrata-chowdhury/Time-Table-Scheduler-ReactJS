import React, { memo, useEffect, useState } from 'react'
import Setting from './Setting'
import '../../Style/Pages/Settings.css'

const SettingsPage: React.FC = (): JSX.Element => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        changeTheme(isDarkMode);
    }, [isDarkMode]);

    const handleDarkModeChange = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <div style={{ padding: '0 0.5rem', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ color: 'var(--textColor)' }}>Settings</h1>
            <Setting
                heading="Dark Mode"
                description="Enable dark mode by-default it follows system settings"
                type="checkbox"
                value={isDarkMode}
                onChange={handleDarkModeChange}
            />
        </div>
    )
}

export function changeTheme(isDarkMode: boolean) {    
    const root = document.documentElement;
    if (isDarkMode) {
        root.style.setProperty('--background', '#000');
        root.style.setProperty('--textColor', '#fff');
        root.style.setProperty('--containerColor', '#2C3B47');
        root.style.setProperty('--foregroudColor', '#111111');
        root.style.setProperty('--borderColor', '#616B75');
        root.style.setProperty('--menubarIconContainerColor', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--inputPlaceholderColor', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--tagIconColor', 'rgba(255, 255, 255, 0.5)');
    } else {
        root.style.setProperty('--background', '#fff');
        root.style.setProperty('--textColor', '#000');
        root.style.setProperty('--containerColor', '#fff');
        root.style.setProperty('--foregroudColor', '#f0f7ff');
        root.style.setProperty('--borderColor', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--menubarIconContainerColor', '#f0f7ff');
        root.style.setProperty('--inputPlaceholderColor', '#0000007a');
        root.style.setProperty('--tagIconColor', 'rgba(0, 0, 0, 0.5)');
    }
}

export default memo(SettingsPage)