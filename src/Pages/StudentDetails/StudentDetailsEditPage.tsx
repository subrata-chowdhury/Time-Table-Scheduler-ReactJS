import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { studentsData } from '../../data/SampleData'
import { Student } from '../../data/Types'
import Arrow from '../../Icons/Arrow'
import { useNavigate } from 'react-router-dom'

const StudentDetailsEditPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams()
    const student = studentsData.find((student) => student.rollNo === id)
    const [formData, setFormData] = useState<Student>(student || {
        name: '',
        rollNo: '',
        semester: 0,
        section: '',
        email: '',
        phoneNumbers: '',
        address: '',
        attandance: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Update the student data logic here
        console.log('Updated student data:', formData);
    };

    return (
        <div className='student-edit' style={{ flexGrow: 1, color: 'var(--textColor)' }}>
            {student ? (
                <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '2px solid var(--borderColor)', borderRadius: '8px', margin: '0 auto', marginTop: '2rem', background: 'var(--containerColor)' }}>
                    <h2 style={{ margin: 0, padding: 0, marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Arrow arrowStyle={{ fill: 'var(--textColor)', width: 30, height: 30, transform: 'rotate(180deg)', cursor: 'pointer' }} arrowIconClickHandler={() => navigate(-1)} />Edit Student Details
                    </h2>
                    <div className='col-2 col-md-1'>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</label>
                            <input className='input-box' type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No:</label>
                            <input className='input-box' type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester:</label>
                            <input className='input-box' type="text" name="semester" value={formData.semester} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section:</label>
                            <input className='input-box' type="text" name="section" value={formData.section} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</label>
                            <input className='input-box' type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</label>
                            <input className='input-box' type="text" name="phoneNumbers" value={formData.phoneNumbers} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</label>
                            <input className='input-box' type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                            <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance:</label>
                            <input className='input-box' type="text" name="attandance" value={formData.attandance} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='save-btn-container' style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
                        <button type="submit">Save</button>
                    </div>
                </form>
            ) : (
                <div style={{ textAlign: 'center' }}>Student not found</div>
            )}
        </div>
    )
}

export default StudentDetailsEditPage