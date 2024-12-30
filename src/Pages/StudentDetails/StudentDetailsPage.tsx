import React from 'react'
import { useParams } from 'react-router-dom'
import { studentsData } from '../../data/SampleData'
import Arrow from '../../Icons/Arrow'
import { useNavigate } from 'react-router-dom'

const StudentDetailsPage: React.FC = (): JSX.Element => {
    const { id } = useParams()
    const navigate = useNavigate();
    const student = studentsData.filter((student) => student.rollNo === id)
    return (
        <div style={{ flexGrow: 1, color: 'var(--textColor)' }}>
            {student.length > 0 ? (
                <div style={{ padding: '2rem', border: '2px solid var(--borderColor)', borderRadius: '8px', margin: '0 auto', width: '90%', marginTop: '2rem', background: 'var(--containerColor)' }}>
                    <h2 style={{ margin: 0, padding: 0, marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Arrow arrowStyle={{ fill: 'var(--textColor)', width: 30, height: 30, transform: 'rotate(180deg)', cursor: 'pointer' }} arrowIconClickHandler={() => navigate(-1)} />
                        <span>Student Details</span>
                    </h2>
                    <div className='col-2 col-md-1'>
                        <div style={{ marginBottom: '1.2rem' }} ><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</div> {student[0].name}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No:</div> {student[0].rollNo}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester:</div> {student[0].semester}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section:</div> {student[0].section}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</div> {student[0].email}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</div> {student[0].phoneNumbers}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</div> {student[0].address}</div>
                        <div style={{ marginBottom: '1.2rem' }}><div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance:</div> <span style={{ fontWeight: 600, color: Number(student[0].attandance) >= 70 ? 'var(--greenText)' : 'var(--redText)' }}>{student[0].attandance}%</span></div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>Student not found</div>
            )}
        </div>
    )
}

export default StudentDetailsPage