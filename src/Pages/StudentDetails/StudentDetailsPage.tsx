import React, { JSX, memo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Arrow from '../../Icons/Arrow'
import { useNavigate } from 'react-router-dom'
import { getStudent } from '../../Script/StudentDataFetcher'
import { Student } from '../../data/Types'

const StudentDetailsPage: React.FC = (): JSX.Element => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student>({
        name: '',
        rollNo: '',
        semester: 0,
        section: 0,
        email: '',
        phoneNumbers: '',
        address: '',
        attendance: 0,
    })

    useEffect(() => {
        // Fetch the student data and update the state
        if (id)
            getStudent(id, data => {
                setStudent(data);
            })
    }, [])

    return (
        <div style={{ flexGrow: 1, color: 'var(--textColor)' }}>
            {student !== null ? (
                <div style={{ padding: '2rem', border: '2px solid var(--borderColor)', borderRadius: '8px', margin: '0 auto', width: '90%', marginTop: '2rem', background: 'var(--containerColor)' }}>
                    <h2 style={{ margin: 0, padding: 0, marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Arrow arrowStyle={{ fill: 'var(--textColor)', width: 30, height: 30, transform: 'rotate(180deg)', cursor: 'pointer' }} arrowIconClickHandler={() => navigate(-1)} />
                        <span>Student Details</span>
                    </h2>
                    <div className='col-2 col-md-1'>
                        <div style={{ marginBottom: '1.2rem' }} ><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</div> {student.name}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No:</div> {student.rollNo}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester:</div> {student.semester}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section:</div> {String.fromCharCode(student.section + 65) || 'N/A'}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</div> {student.email}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</div> {student.phoneNumbers || 'N/A'}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</div> {student.address || 'N/A'}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance:</div> <span style={{ fontWeight: 600, color: Number(student?.attendance) >= 70 ? 'var(--greenText)' : 'rgb(255, 82, 43)' }}>{student?.attendance}%</span></div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>Student not found</div>
            )}
        </div>
    )
}

export default memo(StudentDetailsPage)