import React, { memo, useEffect, useState } from 'react'
import Setting from './Setting'
import '../../Style/Pages/Settings.css'
import { getConfig, setConfig } from '../../Script/configFetchers';
import ExcelArrayObjConverted from '../../Components/ExcelArrayObjConverted';
import StudentFilter from '../../Components/StudentFilter';
import EmailSender from '../../Components/EmailSenderBtn';
import { deleteStudents, getStudents } from '../../Script/StudentDataFetcher';
import { Student } from '../../data/Types';
import { useConfirm } from '../../Components/ConfirmContextProvider';
import { useAlert } from '../../Components/AlertContextProvider';

const SettingsPage: React.FC = (): JSX.Element => {
    const [theme, setTheme] = useState<string>('System');
    const [emails, setEmails] = useState<string[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const { showErrorConfirm } = useConfirm();
    const { showSuccess } = useAlert()

    useEffect(() => {
        getConfig('theme', theme => setTheme(theme || 'System'), () => setTheme('System'))
        getStudents(students => setStudents(students))
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
                        <ExcelArrayObjConverted exportDataGetter={getStudents} />
                    }
                />
                <Setting
                    heading='Send Bulk Email'
                    description='Send bulk emails to students'
                    value=""
                    onChange={() => { }}
                    component={
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                            <StudentFilter students={students} onChange={students => { setEmails(students.map(student => student.email)) }} />
                            <EmailSender emailList={emails} />
                        </div>
                    }
                />
                <Setting
                    heading='Bulk Delete'
                    description='Delete Students and Teachers Data'
                    value=""
                    onChange={() => { }}
                    component={
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                            <button
                                style={{
                                    fontSize: '0.9rem',
                                    padding: '0.6rem 1rem',
                                    paddingLeft: '1rem',
                                    backgroundColor: 'rgb(255, 82, 43)',
                                    border: '2px solid rgb(255, 82, 43)',
                                    color: '#fff',
                                    borderRadius: 5,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => {
                                    showErrorConfirm('Are you sure you want to delete all students?', () => {
                                        deleteStudents(() => {
                                            setStudents([]);
                                            showSuccess('All Students data deleted successfully')
                                        })
                                    })
                                }}>Delete Students</button>
                            <button
                                style={{
                                    fontSize: '0.9rem',
                                    padding: '0.6rem 1rem',
                                    paddingLeft: '1rem',
                                    backgroundColor: 'rgb(255, 82, 43)',
                                    border: '2px solid rgb(255, 82, 43)',
                                    color: '#fff',
                                    borderRadius: 5,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => {
                                    showErrorConfirm('Are you sure you want to delete all teachers?', () => {
                                        // add api call here
                                    })
                                }}>Delete Teachers</button>
                        </div>
                    }
                />
            </div>
        </div >
    )
}

export function changeTheme(theme: string) {
    const root = document.documentElement;
    if (theme === 'Dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export default memo(SettingsPage)