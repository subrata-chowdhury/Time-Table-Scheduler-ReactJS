import React, { JSX, memo, useCallback, useEffect, useState } from 'react'
import Loader from '../../Components/Loader'
import MiniStateContainer from '../../Components/MiniStateContainer'
import SearchBar from '../../Components/SearchBar'
import Table from '../../Components/Table'
import Trash from '../../Icons/Trash'
import { Link, useNavigate } from 'react-router-dom'
import { Student } from '../../data/Types'
import Cross from '../../Icons/Cross'
import { useConfirm } from '../../Components/ConfirmContextProvider'
import StudentFilter from '../../Components/StudentFilter'
import ArrowFilled from '../../Icons/ArrowFilled'
import Sort from '../../Icons/Sort'
import Plus from '../../Icons/Plus'
import { deleteStudent, getStudents, setStudents } from '../../Script/StudentDataFetcher'
import { useAlert } from '../../Components/AlertContextProvider'

const StudentsPage: React.FC = (): JSX.Element => {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [studentsList, setStudentsList] = useState<Student[]>([])
    const [filteredStudentList, setFilteredStudentList] = useState<Student[]>([])
    const [showShortPopup, setShowShortPopup] = useState(false)
    const [sortKeys, setSortKeys] = useState<(keyof Student)[]>([])

    const navigate = useNavigate();

    const { showWarningConfirm } = useConfirm()
    const { showSuccess, showError } = useAlert()

    useEffect(() => {
        startUpFunction()
    }, [])

    const startUpFunction = useCallback(async () => {
        // getStudentList(setStudentsList) // api call
        setDisplayLoader(true)
        await getStudents((data) => {
            setStudentsList(data)
            setFilteredStudentList(data)
        })
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

    const deleteStudentHandler = (rollNo: string | number) => {
        showWarningConfirm('Are you sure you want to delete this student?', async () => {
            await deleteStudent(rollNo, async () => {
                showSuccess(`Student with ID: ${rollNo} deleted Successfully`)
                await getStudents(newList => {
                    setStudentsList(newList)
                    setFilteredStudentList(newList)
                })
            }, () => showError('Unable to delete this student'))
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
            <div>
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
                <div style={{ marginRight: '1.5rem', marginLeft: '1.5rem', marginTop: '1rem' }} className='col-2 col-md-1'>
                    <span style={{ display: 'flex', alignItems: 'center', color: 'var(--textColor)' }}>Showing: &nbsp;<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{filteredStudentList.length}</span>&nbsp; Students</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'end' }}>
                        <div
                            title='Add a New Student'
                            className="btn-type2"
                            style={{ borderRadius: '100px', padding: '0.5rem 1rem' }}
                            onClick={() => {
                                navigate('/Students/add')
                            }}>
                            <Plus size={15} />
                            Add
                        </div>
                        <div
                            title='Increment Semesters'
                            className="btn-type2"
                            style={{ borderRadius: '100px', padding: '0.5rem 1rem' }}
                            onClick={() => {
                                showWarningConfirm("Are you sure? This will increment the semester of all students", async () => {
                                    let newList = [...studentsList]
                                    newList.forEach(student => {
                                        student.semester = student.semester + 1
                                    })
                                    await setStudents(newList, () => {
                                        showSuccess('Semester incremented successfully')
                                        startUpFunction();
                                    }, () => {
                                        showError('Unable to increment semester')
                                    })
                                })
                            }}>
                            <ArrowFilled size={18} rotate={180} style={{ position: 'relative', top: 5 }} />
                            Sem
                        </div>
                        <div
                            title='Decrement Semesters'
                            className="btn-type2"
                            style={{ borderRadius: '100px', padding: '0.5rem 1rem' }}
                            onClick={() => {
                                showWarningConfirm("Are you sure? This will decrement the semester of all students", async () => {
                                    let newList = [...studentsList]
                                    newList.forEach(student => {
                                        student.semester = student.semester - 1
                                    })
                                    await setStudents(newList, () => {
                                        showSuccess('Semester decremented successfully')
                                        startUpFunction();
                                    }, () => {
                                        showError('Unable to decrement semester')
                                    })
                                })
                            }}>
                            <ArrowFilled size={18} style={{ position: 'relative', bottom: 2 }} />
                            Sem
                        </div>
                        <StudentFilter
                            hidePreView={true}
                            students={studentsList}
                            onChange={(students) => setFilteredStudentList(students)} />
                        <div
                            className="btn-type2"
                            style={{ borderRadius: '100px', padding: '0.5rem 1rem' }}
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
                                component: ({ data }) => <div>{data.semester} - {String.fromCharCode(Number(data.section) + 65)}</div>
                            }, {
                                //     heading: "Sem",
                                //     selector: "semester",
                                //     component: ({ data }) => <div>{data.semester} - {data.section}</div>
                                // }, {
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
                                component: ({ data }) => <div style={{ fontWeight: 600, color: Number(data.attendance) >= 70 ? 'var(--greenText)' : 'rgb(255, 82, 43)' }}>{data.attendance}%</div>
                            }, {
                                heading: 'Actions',
                                selector: 'actions',
                                component: ({ data }) => <div style={{ display: 'flex', gap: 5 }}>
                                    <Link to={'/Students/' + data.rollNo} style={{ cursor: 'pointer', color: 'var(--accentColor)', textDecoration: 'none' }}>Details</Link>
                                    <span>|</span>
                                    <span style={{ cursor: 'pointer', color: 'orange', display: 'flex', alignItems: 'end' }} onClick={() => deleteStudentHandler(data.rollNo)} ><Trash width={20} fill='red' /></span>
                                    <span>|</span>
                                    <Link to={'/Students/edit/' + data.rollNo} style={{ cursor: 'pointer', color: 'var(--accentColor)', textDecoration: 'none' }}>Edit</Link>
                                </div>
                            }]}
                            data={sortStudents(filteredStudentList, sortKeys)}
                            tableStyle={{ width: '98%' }}
                        />
                    </div>
                </div>
            </div>
            {displayLoader && <Loader />}
        </>
    )
}

export default memo(StudentsPage)

const sortStudents = (students: Student[], keys: (keyof Student)[] = []): Student[] => {
    return students.sort((a, b) => {
        for (let key of keys) {
            if (a[key] !== undefined && b[key] !== undefined) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
            }
        }
        return 0;
    });
}