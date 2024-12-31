import React, { useState } from 'react'
import { Student } from '../../data/Types';
import Arrow from '../../Icons/Arrow';
import { useNavigate } from 'react-router-dom';

function AddStudentDetailsPage() {
    const [formData, setFormData] = useState<Student>({
        name: '',
        rollNo: '',
        semester: 1,
        section: '',
        email: '',
        phoneNumbers: '',
        address: '',
        attendance: 0
    });

    const navigate = useNavigate();

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

    const onAdd = () => alert("Added: " + JSON.stringify(formData, null, 2))

    return (
        <div className='student-edit' style={{ flexGrow: 1, color: 'var(--textColor)' }}>
            <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '2px solid var(--borderColor)', borderRadius: '8px', width: '90%', margin: '0 auto', marginTop: '2rem', background: 'var(--containerColor)' }}>
                <h2 style={{ margin: 0, padding: 0, marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Arrow arrowStyle={{ fill: 'var(--textColor)', width: 30, height: 30, transform: 'rotate(180deg)', cursor: 'pointer' }} arrowIconClickHandler={() => navigate(-1)} />
                    <span>Add Student Details</span>
                </h2>
                <div className='col-2 col-md-1'>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</label>
                        <input className='input-box' type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No:</label>
                        <input className='input-box' type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="e.g. 12345" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester:</label>
                        <input className='input-box' type="text" name="semester" value={formData.semester} onChange={handleChange} placeholder="e.g. 1" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section:</label>
                        <input className='input-box' type="text" name="section" value={formData.section} onChange={handleChange} placeholder="e.g. A" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</label>
                        <input className='input-box' type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. johndoe@example.com" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</label>
                        <input className='input-box' type="text" name="phoneNumbers" value={formData.phoneNumbers} onChange={handleChange} placeholder="e.g. 1234567890" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</label>
                        <input className='input-box' type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 123 Main St" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance (%):</label>
                        <input className='input-box' type="text" name="attendance" value={formData.attendance} onChange={handleChange} placeholder="e.g. 85" />
                    </div>
                </div>
                <div className='save-btn-container'>
                    <button type="submit" style={{ width: '100%', fontWeight: 600, border: '2px solid var(--accentColor)', background: 'var(--accentColor)', textAlign: 'center', marginTop: '0.5rem' }} onClick={() => onAdd()}>Add</button>
                </div>
            </form>
        </div>
    )
}

export default AddStudentDetailsPage