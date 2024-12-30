import React, { useState } from "react";
import { Student } from "../data/Types";
import { Dropdown } from "../Pages/Settings/Setting";
import Table from "./Table";
import Filter from "../Icons/Filter";
import Eye from "../Icons/Eye";

const StudentFilter: React.FC<{ students: Student[], onChange?: (students: Student[]) => void }> = ({ students, onChange = () => { } }) => {
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const [filteredStudents, setFilterStudents] = useState<Student[]>(students);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showViewPopup, setShowViewPopup] = useState(false);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    };
    function onApply() {
        const applyFilters = (students: Student[]) => {
            const newStudents = students.filter(student => {
                return Object.keys(filters).every(key => {
                    if (typeof filters[key] === 'string') {
                        return student[key as keyof Student].toString().toLowerCase().includes(filters[key].toLowerCase());
                    } else if (typeof filters[key] === 'number') {
                        if (key.startsWith('lt_')) {
                            return student[key.slice(3) as keyof Student] as number < filters[key];
                        } else if (key.startsWith('gt_')) {
                            return student[key.slice(3) as keyof Student] as number > filters[key];
                        } else if (key.startsWith('eq_')) {
                            return student[key.slice(3) as keyof Student] === filters[key];
                        }
                    }
                    return student[key as keyof Student] === filters[key];
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
                <div className='col-2 col-md-1' style={{ width: '50%', background: 'var(--containerColor)', padding: '2rem', borderRadius: '1rem' }}>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Name"
                            onChange={e => handleFilterChange('name', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Roll No"
                            onChange={e => handleFilterChange('rollNo', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester:</label>
                        <input
                            className='input-box'
                            type="number"
                            placeholder="Semester"
                            onChange={e => handleFilterChange('semester', Number(e.target.value))}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Section"
                            onChange={e => handleFilterChange('section', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Email"
                            onChange={e => handleFilterChange('email', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Phone Numbers"
                            onChange={e => handleFilterChange('phoneNumbers', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</label>
                        <input
                            className='input-box'
                            type="text"
                            placeholder="Address"
                            onChange={e => handleFilterChange('address', e.target.value)}
                        />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance:</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Dropdown
                                value="gt"
                                options={['lt', 'gt', 'eq']}
                                onChange={(value) => handleFilterChange('attendanceFilterType', value)}
                            />
                            <input
                                className='input-box'
                                type="number"
                                placeholder="Attendance"
                                onChange={e => handleFilterChange('attendance', Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onApply}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--containerColor)',
                            border: '2px solid var(--borderColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}>Apply</button>
                    <button
                        onClick={() => setFilterStudents(students)}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--containerColor)',
                            border: '2px solid var(--borderColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}>Reset</button>
                    <button
                        onClick={() => setShowFilterPopup(false)}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--containerColor)',
                            border: '2px solid var(--borderColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}>Cancel</button>
                </div>
            </div>}
            {showViewPopup && <div style={{ color: 'var(--textColor)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 100, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowViewPopup(false)}>
                <h2>Filtered Students ({filteredStudents.length})</h2>
                <div style={{ overflow: 'auto', maxHeight: '80vh', width: '80%', background: 'black' }}>
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
            <div onClick={() => setShowFilterPopup(val => !val)} style={{ cursor: 'pointer', border: '2px solid var(--borderColor)', borderRadius: 8, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto 0' }}>
                <Filter size={18} />
            </div>
            <div onClick={() => setShowViewPopup(val => !val)} style={{ cursor: 'pointer', border: '2px solid var(--borderColor)', borderRadius: 8, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto 0' }}>
                <Eye size={18} />
            </div>
        </>
    );
};

export default StudentFilter