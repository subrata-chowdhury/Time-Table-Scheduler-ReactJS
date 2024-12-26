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

const StudentsPage: React.FC = (): JSX.Element => {
    const [displayLoader, setDisplayLoader] = useState(false);

    const [studentsList, setStudentsList] = useState<Student[]>(studentsData || [])
    const [filteredStudentList, setFilteredStudentList] = useState<Student[]>(studentsData || [])
    const [showShortPopup, setShowShortPopup] = useState(false)
    const [sortKeys, setSortKeys] = useState<(keyof Student)[]>([])

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
                                id: 'attandance',
                                label: 'Attandance'
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
                        dontProcces={true} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2rem', marginTop: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem', color: 'var(--textColor)' }}>Showing: &nbsp;<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{filteredStudentList.length}</span>&nbsp; Students</span>
                    <div style={{ background: 'var(--containerColor)', padding: '.5rem 1rem', border: '2px solid var(--borderColor)', borderRadius: '100px', cursor: 'pointer', color: 'var(--textColor)' }} onClick={() => setShowShortPopup(true)}>Sort By</div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', maxHeight: '78vh', flexGrow: 1, marginTop: '1rem' }}>
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
                            }, {
                                heading: "Section",
                                selector: "section",
                            }, {
                                heading: "Email",
                                selector: "email",
                            }, {
                                heading: "Attandance",
                                selector: "attandance",
                                component: ({ data }) => <div style={{ fontWeight: 600, color: Number(data.attandance) >= 70 ? 'green' : 'red' }}>{data.attandance}%</div>
                            }, {
                                heading: 'Actions',
                                selector: 'actions',
                                component: ({ data }) => <div style={{ display: 'flex', gap: 5 }}>
                                    <Link to={'/Students/' + data.rollNo} style={{ cursor: 'pointer', color: 'var(--accentColor)', textDecoration: 'none' }}>Details</Link>
                                    <span>|</span>
                                    <span style={{ cursor: 'pointer', color: 'orange', display: 'flex', alignItems: 'end' }}><Trash width={20} fill='red' /></span>
                                    <span>|</span>
                                    <span style={{ cursor: 'pointer', color: 'var(--accentColor)' }}>Edit</span>
                                </div>
                            }]}
                            data={sortStudents(filteredStudentList, sortKeys)}
                            tableStyle={{ width: '95%' }}
                        />
                    </div>
                </div>
            </div>
            {displayLoader && <Loader />}
        </>
    )
}

export default StudentsPage

const sortStudents = (students: Student[], keys: (keyof Student)[] = []): Student[] => {
    return students.sort((a, b) => {
        for (let key of keys) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
        }
        return 0;
    });
}