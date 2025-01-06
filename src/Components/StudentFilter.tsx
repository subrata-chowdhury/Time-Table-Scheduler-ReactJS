import React, { useState } from "react";
import { Student } from "../data/Types";
import { Dropdown } from "../Pages/Settings/Setting";
import Table from "./Table";
import Filter from "../Icons/Filter";
import Eye from "../Icons/Eye";

type AttendanceCondition = 'lt' | 'gt' | 'eq'

interface StudentFilterProps {
    students: Student[];
    hidePreView?: boolean;
    onChange?: (students: Student[]) => void;
}

const StudentFilter: React.FC<StudentFilterProps> = ({ students, hidePreView = false, onChange = () => { } }) => {
    const [filters, setFilters] = useState<{ [key: string]: string | number }>({});
    const [filteredStudents, setFilterStudents] = useState<Student[]>(students);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [attendanceCondition, setAttendanceCondition] = useState<AttendanceCondition>('lt')

    const handleFilterChange = (key: string, value: string | number) => {
        setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    };

    function onApply() {
        const processedFilters = { ...filters };
        Object.keys(processedFilters).map(key => {
            if (processedFilters[key] === '') {
                delete processedFilters[key];
            }
        });
        console.log('Applying filters:', processedFilters);
        const applyFilters = (students: Student[]) => {
            const newStudents = students.filter(student => {
                return Object.keys(processedFilters).every(key => {
                    if (processedFilters[key] === '') return true;
                    else if (processedFilters[key] === 'All') return true;
                    else if (key === 'rollNo' || key === 'section') {
                        return student[key].toString().toLowerCase().includes(String(processedFilters[key]).toLowerCase());
                    } else if (key === 'semester') {
                        return student[key] === Number(processedFilters[key]);
                    } else if (key === 'attendance') {
                        if (attendanceCondition === 'lt') return student[key] < Number(processedFilters[key]);
                        else if (attendanceCondition === 'gt') return student[key] > Number(processedFilters[key]);
                        else if (attendanceCondition === 'eq') return student[key] === Number(processedFilters[key]);
                    }
                    return student[key as keyof Student] === processedFilters[key];
                });
            });
            setFilterStudents(newStudents);
            onChange(newStudents);
        };
        applyFilters(students);
        setShowFilterPopup(false);
    }

    return (
        <>
            {showFilterPopup && <div style={{ color: 'var(--textColor)', position: 'fixed', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 100, background: 'rgba(0, 0, 0, 0.5)' }}>
                <div className='col-2 col-md-1' style={{ width: '50%', background: 'var(--containerColor)', padding: '2rem', borderRadius: '1rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                    {/* <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Name"
                            onChange={e => handleFilterChange('name', e.target.value)}
                        />
                    </div> */}
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No: <small>(Optional)</small></label>
                        <input
                            value={filters.rollNo || ''}
                            className='input-box'
                            type="text"
                            placeholder="Roll No"
                            onChange={e => handleFilterChange('rollNo', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester: *</label>
                        <Dropdown
                            options={['All', 1, 2, 3, 4, 5, 6, 7, 8].map(String)}
                            value={String(filters.semester || "All")}
                            onChange={(value) => handleFilterChange('semester', value)}
                        />
                        {/* <input
                            className='input-box'
                            type="number"
                            placeholder="Semester"
                            onChange={e => handleFilterChange('semester', Number(e.target.value))}
                        /> */}
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section: <small>(Optional)</small></label>
                        <input
                            value={filters.section || ''}
                            className='input-box'
                            type="text"
                            placeholder="Section"
                            onChange={e => handleFilterChange('section', e.target.value)}
                        />
                    </div>
                    {/* <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Email"
                            onChange={e => handleFilterChange('email', e.target.value)}
                        />
                    </div> */}
                    {/* <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Phone Numbers"
                            onChange={e => handleFilterChange('phoneNumbers', e.target.value)}
                        />
                    </div> */}
                    {/* <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Address"
                            onChange={e => handleFilterChange('address', e.target.value)}
                        />
                    </div> */}
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance: <small>(Optional)</small></label>
                        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '0.5rem' }}>
                            <Dropdown
                                value={attendanceCondition === 'lt' ? "Less Than" : attendanceCondition === 'gt' ? "Greater Than" : "Equal To"}
                                options={["Less Than", "Greater Than", "Equal To"]}
                                onChange={(value) => {
                                    switch (value) {
                                        case "Less Than":
                                            setAttendanceCondition('lt')
                                            break;
                                        case "Greater Than":
                                            setAttendanceCondition('gt')
                                            break;
                                        case "Equal To":
                                            setAttendanceCondition('eq')
                                            break;
                                    }
                                }}
                            />
                            <input
                                value={filters.attendance || ''}
                                className='input-box'
                                type="number"
                                placeholder="Attendance"
                                onChange={e => handleFilterChange('attendance', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '50%', gap: '1rem', background: 'var(--containerColor)', padding: '2rem', paddingTop: 0, borderRadius: '1rem', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    <button
                        onClick={onApply}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--accentColor)',
                            border: '2px solid var(--accentColor)',
                            color: '#fff',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1rem',
                            fontWeight: 600
                        }}>Apply</button>
                    <button
                        onClick={() => setFilterStudents(students)}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--containerColor)',
                            border: '2px solid var(--accentColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            marginTop: '1rem'
                        }}>Reset</button>
                    <button
                        onClick={() => setShowFilterPopup(false)}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--containerColor)',
                            border: '2px solid var(--accentColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            marginTop: '1rem'
                        }}>Cancel</button>
                </div>
            </div>}
            {showViewPopup && <div style={{ color: 'var(--textColor)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 100, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowViewPopup(false)}>
                <h2>Filtered Students ({filteredStudents.length})</h2>
                <div style={{ overflow: 'auto', maxHeight: '80vh', width: '80%', backgroundColor: 'var(--containerColor)', borderRadius: 8 }}>
                    <Table
                        data={filteredStudents}
                        config={[
                            { selector: 'name', heading: 'Name' },
                            { selector: 'rollNo', heading: 'Roll No' },
                            { selector: 'semester', heading: 'Semester' },
                            { selector: 'section', heading: 'Section' },
                            { selector: 'email', heading: 'Email' },
                            { selector: 'phoneNumbers', heading: 'Phone Numbers' },
                            { selector: 'address', heading: 'Address' },
                            { selector: 'attendance', heading: 'Attendance' }
                        ]}
                        tableStyle={{ width: '100%' }}
                    />
                </div>
            </div>}
            <div title="Filter Students Data" onClick={() => setShowFilterPopup(val => !val)} className="btn-type2" style={{ padding: '0.5rem' }}>
                <Filter size={18} />
            </div>
            {!hidePreView && <div title="View Student Data" onClick={() => setShowViewPopup(val => !val)} className="btn-type2" style={{ padding: '0.5rem' }}>
                <Eye size={18} />
            </div>}
        </>
    );
};

export default StudentFilter