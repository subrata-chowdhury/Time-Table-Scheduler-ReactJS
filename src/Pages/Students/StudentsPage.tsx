import React, { useCallback, useEffect, useState } from 'react'
import Loader from '../../Components/Loader'
import MiniStateContainer from '../../Components/MiniStateContainer'
import SearchBar from '../../Components/SearchBar'
import Table from '../../Components/Table'
import Trash from '../../Icons/Trash'
import { Link } from 'react-router-dom'
import { Student } from '../../data/Types'
import { studentsData } from '../../data/SampleData'
import Cross from '../../Icons/Cross'
import { useConfirm } from '../../Components/ConfirmContextProvider'
import StudentFilter from '../../Components/StudentFilter'
import ArrowFilled from '../../Icons/ArrowFilled'
import Sort from '../../Icons/Sort'

const StudentsPage: React.FC = (): JSX.Element => {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [studentsList, setStudentsList] = useState<Student[]>(studentsData || [])
    const [filteredStudentList, setFilteredStudentList] = useState<Student[]>(studentsData || [])
    const [showShortPopup, setShowShortPopup] = useState(false)
    const [sortKeys, setSortKeys] = useState<(keyof Student)[]>([])
    const [showAddModel, setShowAddModel] = useState(false)

    const { showWarningConfirm } = useConfirm()

    useEffect(() => {
        startUpFunction()
    }, [])

    const startUpFunction = useCallback(() => {
        // getStudentList(setStudentsList) // api call
        setStudentsList(studentsData) // remove when api get implemented
        setDisplayLoader(false)
    }, [])

    const sortCheckboxChangeHandler = (id: keyof Student) => {
        if (sortKeys.includes(id)) {
            const keys = [...sortKeys]
            keys.splice(keys.indexOf(id), 1)
            setSortKeys(keys)
        } else {
            const keys = [...sortKeys]
            keys.push(id)
            setSortKeys(keys)
        }
    }

    const deleteStudent = (rollNo: string | number) => {
        // deleteStudent(rollNo) // api call
        showWarningConfirm('Are you sure you want to delete this student?', () => {
            const newList = studentsList.filter(student => student.rollNo !== rollNo)
            setStudentsList(newList)
            setFilteredStudentList(newList)
        })
    }


    return (
        <>
            {showShortPopup && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, background: 'rgba(0, 0, 0, 0.5)', color: 'var(--textColor)', zIndex: 20 }}>
                <div style={{ background: 'var(--containerColor)', borderRadius: '1rem', width: '50%', padding: '2rem', paddingTop: '1rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--borderColor)' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>Sort By</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => setShowShortPopup(false)}><Cross size={20} fillColor='var(--textColor)' /></div>
                    </div>
                    <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 9rem)', gap: '1rem' }}>
                        {
                            [{
                                id: 'name',
                                label: 'Name'
                            }, {
                                id: 'rollNo',
                                label: 'Roll No'
                            }, {
                                id: 'semester',
                                label: 'Sem'
                            }, {
                                id: 'section',
                                label: 'Section'
                            }, {
                                id: 'email',
                                label: 'Email'
                            }, {
                                id: 'attendance',
                                label: 'Attendance'
                            }].map((obj, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: 20,
                                            border: '2px solid var(--borderColor)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#fff',
                                            fontSize: '0.8rem',
                                            background: sortKeys.includes(obj.id as keyof Student) ? "var(--accentColor)" : ""
                                        }}
                                        onClick={() => sortCheckboxChangeHandler(obj.id as keyof Student)} >
                                        {sortKeys.indexOf(obj.id as keyof Student) != -1 ? sortKeys.indexOf(obj.id as keyof Student) + 1 : ""}
                                    </div>
                                    <label htmlFor={obj.id}>{obj.label}</label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>}
            <div >
                <div className='tools-container'>
                    <MiniStateContainer onChange={startUpFunction} />
                    <SearchBar
                        array={[]}
                        onChange={(_, value) => {
                            if (value) {
                                let newList = studentsList.filter(student => student.name.toUpperCase().indexOf(value as string) !== -1)
                                setFilteredStudentList(newList)
                                return
                            }
                            if (value === '') {
                                setFilteredStudentList(studentsList)
                            }
                        }}
                        dontProccess={true} />
                </div>
                <div style={{ marginRight: '2rem', marginTop: '1rem' }} className='col-2 col-md-1'>
                    <span style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem', color: 'var(--textColor)' }}>Showing: &nbsp;<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{filteredStudentList.length}</span>&nbsp; Students</span>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'end' }}>
                        <div
                            title='Add a New Student'
                            style={{
                                background: 'var(--containerColor)',
                                padding: '.5rem 1rem',
                                border: '2px solid var(--borderColor)',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                color: 'var(--textColor)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => {
                                setShowAddModel(true)
                            }}>
                            Add
                        </div>
                        <div
                            title='Increment Semesters'
                            style={{
                                background: 'var(--containerColor)',
                                padding: '.5rem 1rem',
                                border: '2px solid var(--borderColor)',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                color: 'var(--textColor)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => {
                                let newList = [...studentsList]
                                newList.forEach(student => {
                                    student.semester = Number(student.semester) + 1
                                })
                                setStudentsList(newList)
                                setFilteredStudentList(newList)
                            }}>
                            <ArrowFilled size={18} rotate={180} style={{ position: 'relative', top: 5 }} />
                            Sem
                        </div>
                        <div
                            title='Decrement Semesters'
                            style={{
                                background: 'var(--containerColor)',
                                padding: '.5rem 1rem',
                                border: '2px solid var(--borderColor)',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                color: 'var(--textColor)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => {
                                let newList = [...studentsList]
                                newList.forEach(student => {
                                    student.semester = Number(student.semester) - 1
                                })
                                setStudentsList(newList)
                                setFilteredStudentList(newList)
                            }}>
                            <ArrowFilled size={18} style={{ position: 'relative', bottom: 2 }} />
                            Sem
                        </div>
                        <StudentFilter
                            hidePreView={true}
                            students={studentsData}
                            onChange={(students) => setFilteredStudentList(students)} />
                        <div
                            style={{
                                background: 'var(--containerColor)',
                                padding: '.5rem 1rem',
                                border: '2px solid var(--borderColor)',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                color: 'var(--textColor)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => setShowShortPopup(true)}><Sort />Sort By</div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
                    {/* <Cards
                        cardList={filterdSubjectList}
                        cardClassName={"subject-card"}
                        onCardClick={(name) => {
                            setActiveSubjectName(name)
                            setShowDetailsPopup(true)
                        }}
                        onAddBtnClick={() => {
                            setActiveSubjectName("")
                            setShowDetailsPopup(true)
                        }}
                    /> */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', height: '76vh', flexGrow: 1, marginTop: '1rem' }}>
                        <Table
                            config={[{
                                heading: "Name",
                                selector: "name",
                            }, {
                                heading: "Roll No",
                                selector: "rollNo",
                            }, {
                                heading: "Sem",
                                selector: "semester",
                                component: ({ data }) => <div>{data.semester} - {data.section}</div>
                            }, {
                                //     heading: "Section",
                                //     selector: "section",
                                // }, {
                                heading: "Email",
                                selector: "email",
                                hideAble: true
                            }, {
                                heading: "Attendance",
                                selector: "attendance",
                                hideAble: true,
                                component: ({ data }) => <div style={{ fontWeight: 600, color: Number(data.attendance) >= 70 ? 'var(--greenText)' : 'var(--redText)' }}>{data.attendance}%</div>
                            }, {
                                heading: 'Actions',
                                selector: 'actions',
                                component: ({ data }) => <div style={{ display: 'flex', gap: 5 }}>
                                    <Link to={'/Students/' + data.rollNo} style={{ cursor: 'pointer', color: 'var(--accentColor)', textDecoration: 'none' }}>Details</Link>
                                    <span>|</span>
                                    <span style={{ cursor: 'pointer', color: 'orange', display: 'flex', alignItems: 'end' }} onClick={() => deleteStudent(data.rollNo)} ><Trash width={20} fill='red' /></span>
                                    <span>|</span>
                                    <Link to={'/Students/edit/' + data.rollNo} style={{ cursor: 'pointer', color: 'var(--accentColor)', textDecoration: 'none' }}>Edit</Link>
                                </div>
                            }]}
                            data={sortStudents(filteredStudentList, sortKeys)}
                            tableStyle={{ width: '95%' }}
                        />
                    </div>
                </div>
            </div>
            {displayLoader && <Loader />}
            {showAddModel && <AddStudentModel onAdd={(student) => alert("Added: " + JSON.stringify(student, null, 2))} onClose={() => setShowAddModel(false)} />}
        </>
    )
}

export default StudentsPage

interface AddStudentModelProps {
    onClose: () => void
    onAdd: (student: Student) => void
}

const AddStudentModel: React.FC<AddStudentModelProps> = ({ onAdd = () => { }, onClose = () => { } }) => {
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
        <div className='student-edit' style={{ flexGrow: 1, color: 'var(--textColor)', position: 'fixed', top: 0, left: 0, width: '100%', minHeight: '100vh', zIndex: 100, background: 'rgba(0, 0, 0, 0.4)' }}>
            <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '2px solid var(--borderColor)', borderRadius: '8px', width: '80%', margin: '0 auto', marginTop: '0', background: 'var(--containerColor)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <h2 style={{ margin: 0, padding: 0, marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Add Student Details</span>
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
                        <label className='input-box-heading' style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem' }}>Attendance (%):</label>
                        <input className='input-box' type="text" name="attendance" value={formData.attendance} onChange={handleChange} />
                    </div>
                </div>
                <div className='save-btn-container'>
                    <button type="submit" style={{ width: '100%', fontWeight: 600, border: '2px solid var(--accentColor)', background: 'var(--accentColor)', textAlign: 'center', marginTop: '0.5rem' }} onClick={() => onAdd(formData)}>Add</button>
                    <button style={{ width: '100%', fontWeight: 600, border: '2px solid var(--borderColor)', background: 'var(--containerColor)', textAlign: 'center', marginTop: '0.5rem' }} onClick={onClose}>Close</button>
                </div>
            </form>
        </div>
    )
}

const sortStudents = (students: Student[], keys: (keyof Student)[] = []): Student[] => {
    return students.sort((a, b) => {
        for (let key of keys) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
        }
        return 0;
    });
}