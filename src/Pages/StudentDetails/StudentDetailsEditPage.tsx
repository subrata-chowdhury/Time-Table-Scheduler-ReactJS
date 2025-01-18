import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Student } from '../../data/Types'
import Arrow from '../../Icons/Arrow'
import { useNavigate } from 'react-router-dom'
import { getStudent, setStudents } from '../../Script/StudentDataFetcher'
import { useAlert } from '../../Components/AlertContextProvider'

interface StudentDetails extends Student {
    sec: string,
    sem: number
}

const StudentDetailsEditPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState<StudentDetails>({
        name: '',
        rollNo: '',
        semester: 0,
        section: '',
        email: '',
        phoneNumbers: '',
        address: '',
        attendance: 0,
        sem: 0,
        sec: ''
    });

    useEffect(() => {
        // Fetch the student data and update the state
        if (id)
            getStudent(id, data => {
                setFormData({
                    ...data,
                    sec: String.fromCharCode(data.sec + 65)
                });
            })
    }, [])

    const { showSuccess, showError } = useAlert()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Update the student data logic here
        await setStudents(
            [{
                name: formData.name,
                rollNo: formData.rollNo,
                semester: formData.sem,
                section: formData.sec,
                email: formData.email,
                phoneNumbers: formData.phoneNumbers,
                address: formData.address,
                attendance: formData.attendance
            }],
            () => {
                console.log('Updated student data:', formData);
                showSuccess("Student details updated Successfully");
            },
            () => showError("Unable to edit student data"));
    };

    return (
        <div className='student-edit' style={{ flexGrow: 1, color: 'var(--textColor)' }}>
            <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '2px solid var(--borderColor)', borderRadius: '8px', width: '90%', margin: '0 auto', marginTop: '2rem', background: 'var(--containerColor)' }}>
                <h2 style={{ margin: 0, padding: 0, marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Arrow arrowStyle={{ fill: 'var(--textColor)', width: 30, height: 30, transform: 'rotate(180deg)', cursor: 'pointer' }} arrowIconClickHandler={() => navigate(-1)} />
                    <span>Edit Student Details</span>
                </h2>
                <div className='col-2 col-md-1'>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Name:</label>
                        <input className='input-box' type="text" name="name" value={formData.name || ""} onChange={handleChange} placeholder="e.g., John Doe" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Roll No:</label>
                        <input className='input-box' type="text" name="rollNo" value={formData.rollNo || ""} onChange={handleChange} placeholder="e.g., 12345" disabled />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Semester:</label>
                        <input className='input-box' type="text" name="sem" value={formData.sem || ""} onChange={handleChange} placeholder="e.g., 5" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Section:</label>
                        <input className='input-box' type="text" name="sec" value={formData.sec || ""} onChange={handleChange} placeholder="e.g., A" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Email:</label>
                        <input className='input-box' type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="e.g., johndoe@example.com" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Phone Numbers:</label>
                        <input className='input-box' type="text" name="phoneNumbers" value={formData.phoneNumbers || ""} onChange={handleChange} placeholder="e.g., 1234567890" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Address:</label>
                        <input className='input-box' type="text" name="address" value={formData.address || ""} onChange={handleChange} placeholder="e.g., 123 Main St, City, Country" />
                    </div>
                    <div className='input-container' style={{ marginBottom: '1.2rem' }}>
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance:</label>
                        <input className='input-box' type="text" name="attendance" value={formData.attendance || ""} onChange={handleChange} placeholder="e.g., 85" />
                    </div>
                </div>
                <div className='save-btn-container' style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}

export default StudentDetailsEditPage