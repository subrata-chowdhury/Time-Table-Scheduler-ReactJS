import React, { memo, useEffect, useState } from 'react'
import Setting from './Setting'
import '../../Style/Pages/Settings.css'
import { getConfig, setConfig } from '../../Script/configFetchers';
import ExcelArrayObjConverted from '../../Components/ExcelArrayObjConverted';
import { studentsData } from '../../data/SampleData';
import StudentFilter from '../../Components/StudentFilter';
import EmailSender from '../../Components/EmailSenderBtn';

const SettingsPage: React.FC = (): JSX.Element => {
    const [theme, setTheme] = useState<string>('System');
    const [emails, setEmails] = useState<string[]>([]);

    useEffect(() => {
        getConfig('theme', theme => setTheme(theme || 'System'), () => setTheme('System'))
    }, [])

    const handleDarkModeChange = (value: string | boolean) => {
        value = String(value)
        if (value === 'System') {
            const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (prefersDarkScheme) changeTheme('Dark');
            else changeTheme('Light');
        } else {
            changeTheme(value)
        }
        setConfig('theme', value, () => setTheme(value))
    };

    return (
        <div style={{ padding: '0 0.5rem', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ color: 'var(--textColor)' }}>Settings</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Setting
                    heading="Choose Theme"
                    description="Enable dark mode, by-default it follows system settings"
                    type="select"
                    options={['System', 'Light', 'Dark']}
                    value={theme}
                    onChange={handleDarkModeChange}
                />
                <Setting
                    heading='Import / Export Student Data'
                    description='Import or export student data in Excel format'
                    value=""
                    onChange={() => { }}
                    component={
                        <ExcelArrayObjConverted exportDataGetter={async () => studentsData} />
                    }
                />
                <Setting
                    heading='Send Bulk Email'
                    description='Send bulk emails to students'
                    value=""
                    onChange={() => { }}
                    component={
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                            <StudentFilter students={studentsData} onChange={students => { setEmails(students.map(student => student.email)) }} />
                            <EmailSender emailList={emails} />
                        </div>
                    }
                />

            </div>
        </div>
    )
}

export function changeTheme(theme: string) {
    const root = document.documentElement;
    if (theme === 'Dark') {
        root.style.setProperty('--background', '#000');
        root.style.setProperty('--textColor', '#fff');
        root.style.setProperty('--containerColor', '#2C3B47');
        root.style.setProperty('--foregroudColor', '#111111');
        root.style.setProperty('--borderColor', '#616B75');
        root.style.setProperty('--menubarIconContainerColor', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--inputPlaceholderColor', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--tagIconColor', 'rgba(255, 255, 255, 0.5)');
        root.style.setProperty('--accentColor', '#56aaff')
        root.style.setProperty('--tableHeaderColor', 'rgba(255, 255, 255, 0.1)')
        root.style.setProperty('--greenText', '#00ff00');
        root.style.setProperty('--redText', '#ff0000');
    } else {
        root.style.setProperty('--background', '#fff');
        root.style.setProperty('--textColor', '#000');
        root.style.setProperty('--containerColor', '#fff');
        root.style.setProperty('--foregroudColor', '#f0f7ff');
        root.style.setProperty('--borderColor', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--menubarIconContainerColor', '#f0f7ff');
        root.style.setProperty('--inputPlaceholderColor', '#0000007a');
        root.style.setProperty('--tagIconColor', 'rgba(0, 0, 0, 0.5)');
        root.style.setProperty('--accentColor', '#1E90FF')
        root.style.setProperty('--tableHeaderColor', '#f5f5f5')
        root.style.setProperty('--greenText', 'green');
        root.style.setProperty('--redText', '#ff0000');
    }
}

export default memo(SettingsPage)