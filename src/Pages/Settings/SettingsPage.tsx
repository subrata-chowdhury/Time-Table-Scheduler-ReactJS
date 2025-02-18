import React, { JSX, memo, useEffect, useState } from 'react'
import Setting from './Setting'
import '../../Style/Pages/Settings.css'
import { getConfig, setConfig } from '../../Script/configFetchers';
import ExcelArrayObjConverted from '../../Components/ExcelArrayObjConverted';
import StudentFilter from '../../Components/StudentFilter';
import EmailSender from '../../Components/EmailSender/EmailSenderBtn';
import { deleteStudents, getStudents, setStudents } from '../../Script/StudentDataFetcher';
import { Student } from '../../data/Types';
import { useConfirm } from '../../Components/ConfirmContextProvider';
import { useAlert } from '../../Components/AlertContextProvider';

const SettingsPage: React.FC = (): JSX.Element => {
    const [theme, setTheme] = useState<string>('System');
    const [emailsWithStudentData, setEmailsWithStudentData] = useState<Student[]>([]);
    const [studentsList, setStudentsList] = useState<Student[]>([]);

    const { showErrorConfirm } = useConfirm();
    const { showSuccess, showError } = useAlert()

    useEffect(() => {
        getConfig('theme', theme => setTheme(theme as string || 'System'), () => setTheme('System'))
        getStudents(students => setStudentsList(students))
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
                    description='Import - export or Share student data in Excel format'
                    value=""
                    onChange={() => { }}
                    component={
                        <ExcelArrayObjConverted exportDataGetter={getStudents} onImport={data => {
                            const filteredData = data.map((student: any) => ({
                                name: student.name,
                                rollNo: student.rollNo,
                                semester: student.semester,
                                section: student.section,
                                email: student.email,
                                phoneNumbers: student.phoneNumbers,
                                address: student.address,
                                attendance: student.attendance,
                            }));
                            const cleanedStudent = [];
                            for (let index = 0; index < filteredData.length; index++) {
                                if (
                                    // filteredData[index].address === null ||
                                    filteredData[index].name === null ||
                                    filteredData[index].rollNo === null ||
                                    filteredData[index].semester === null ||
                                    filteredData[index].section === null ||
                                    filteredData[index].email === null ||
                                    // filteredData[index].phoneNumbers === null ||
                                    filteredData[index].attendance === null) {
                                    continue;
                                }
                                if (
                                    // filteredData[index].address === undefined ||
                                    filteredData[index].name === undefined ||
                                    filteredData[index].rollNo === undefined ||
                                    filteredData[index].semester === undefined ||
                                    filteredData[index].section === undefined ||
                                    filteredData[index].email === undefined ||
                                    // filteredData[index].phoneNumbers === undefined ||
                                    filteredData[index].attendance === undefined) {
                                    continue;
                                }
                                cleanedStudent.push(filteredData[index]);
                            }
                            if (cleanedStudent.length <= 0) {
                                showError("Data must have name, rollNo, semester, section, email and attendance columns");
                                return
                            }
                            setStudents(
                                cleanedStudent,
                                () => showSuccess('Students data imported successfully'),
                                () => showError('Error in importing students data')
                            );
                        }} />
                    }
                />
                <Setting
                    heading='Send Bulk Email'
                    description='Send bulk emails to students'
                    value=""
                    onChange={() => { }}
                    component={
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                            <StudentFilter students={studentsList} onChange={students => { setEmailsWithStudentData(students) }} />
                            <EmailSender studentsData={emailsWithStudentData} />
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
                                    backgroundColor: 'rgb(255, 82, 43)',
                                    border: '2px solid rgb(255, 82, 43)',
                                    color: '#fff',
                                }}
                                className="btn-type2"
                                onClick={() => {
                                    showErrorConfirm('Are you sure you want to delete all students?', () => {
                                        deleteStudents(() => {
                                            setStudentsList([]);
                                            showSuccess('All Students data deleted successfully')
                                        })
                                    })
                                }}>Delete Students</button>
                            <button
                                style={{
                                    backgroundColor: 'rgb(255, 82, 43)',
                                    border: '2px solid rgb(255, 82, 43)',
                                    color: '#fff',
                                }}
                                className="btn-type2"
                                onClick={() => {
                                    showErrorConfirm('Are you sure you want to delete all teachers?', () => {
                                        // add api call here
                                    })
                                }}>Delete Teachers</button>
                        </div>
                    }
                />
                <Setting
                    heading='Import / Export Entire Data'
                    description='Import - export or Share entire data including students, teachers, subjects, time table, etc.'
                    value=""
                    onChange={() => { }}
                    component={
                        <ExcelArrayObjConverted exportDataGetter={getStudents} />
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