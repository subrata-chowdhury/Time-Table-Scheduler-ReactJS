import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import TimeTable from '../Components/TimeTable.tsx'
import "../Style/TimeTablesPage.css"
import Cards, { Card, HorizentalCardsContainer } from '../Components/Cards.tsx'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getSubjectsList, getSubjectsDetailsList, SubjectsDetailsList } from '../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule, getTimeTableStructure, saveSchedule } from '../Script/TimeTableDataFetcher'
import { getTeachersList } from '../Script/TeachersDataFetcher'
import { emptyTimeTableDetails } from '../Components/TimeTable.tsx'
import "../Script/commonJS"
import OwnerFooter from '../Components/OwnerFooter.tsx'
import Loader from '../Components/Loader.tsx'
import { FullTimeTable, TimeTable as TimeTableType, TimeTableStructure } from '../data/Types.ts'

function TimeTablesPage() {
    return (
        <>
            <Menubar activeMenuIndex={3} />
            <div className='main-container time-table'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>
    )
}

function MainComponents() {
    const [sems, setSems] = useState<string[]>([])
    const [subjectsDetails, setSubjectsDetails] = useState<SubjectsDetailsList>()
    const [allTimeTables, setAllTimeTables] = useState<FullTimeTable>()
    const [timeTable, setTimeTable] = useState<TimeTableType>(emptyTimeTableDetails)
    const [currentOpenSem, setCurrentOpenSem] = useState<number>(0)
    const [currentOpenSection, setCurrentOpenSection] = useState<number>(0)
    const [displayLoader, setDisplayLoader] = useState<boolean>(false)
    const [periodDetailsIndex, setPeriodDetailsIndex] = useState<[number, number]>()
    const [timeTableStructure, setTimeTableStructure] = useState<TimeTableStructure>({
        breaksPerSemester: [[4, 5], [5], [5], [5]],
        periodCount: 9,
        sectionsPerSemester: [0, 0, 0, 0],
        semesterCount: 3
    })
    const [showPopUp, setShowPopUp] = useState<boolean>(false)

    const fillManually = useRef<boolean>(true)

    useEffect(() => {
        getSubjectsDetailsList(setSubjectsDetails) // api call
        getTimeTableStructure((data: TimeTableStructure) => { // api call
            if (data) {
                setTimeTableStructure(data)
                let sem = []
                for (let index = 1; index <= data.semesterCount; index++) {
                    sem.push("Year " + index);
                }
                setSems(sem);
            }
        })
    }, [])
    const startUpFunction = useCallback(() => {
        try {
            if (allTimeTables)
                if (allTimeTables[currentOpenSem][currentOpenSection])
                    setTimeTable(allTimeTables[currentOpenSem][currentOpenSection])
                else setTimeTable(emptyTimeTableDetails);
        } catch (error) {
            console.log("%cError in selecting time table", "color: green")
        }
    }, [currentOpenSem, currentOpenSection, allTimeTables])
    useEffect(() => {
        startUpFunction()
    }, [currentOpenSem, currentOpenSection, allTimeTables, startUpFunction])
    useEffect(() => {
        getSchedule(data => { // api call
            setAllTimeTables(data)
        })
    }, [])

    const semCardClickHandler = useCallback((value: string) => {
        let year = parseInt(value.slice(5))
        setCurrentOpenSem(year - 1)
    }, [])
    const setBtnClickHandler = useCallback((activeTeacherName: string[], activeSubjectName: string[]) => {
        if (activeSubjectName.length > 0 && activeTeacherName.length > 0 && periodDetailsIndex) {
            let [dayIndex, periodIndex]: [number, number] = periodDetailsIndex
            let newTimeTable: TimeTableType = [...timeTable]
            if (newTimeTable[dayIndex] === null) return
            newTimeTable[dayIndex][periodIndex] = [
                activeTeacherName.join("+"),
                activeSubjectName[0],
                (subjectsDetails && subjectsDetails[activeSubjectName[0]]) ?
                    subjectsDetails[activeSubjectName[0]].roomCodes[0] : ""
            ]

            newTimeTable ? setTimeTable(newTimeTable) : ""
            saveSchedule(currentOpenSem, currentOpenSection, newTimeTable, () => setShowPopUp(false)) // api call
        }
    }, [subjectsDetails, periodDetailsIndex, timeTable])
    return (
        <>
            <Loader display={displayLoader} />
            <div className='top-sub-container'>
                <div className='menubar'>
                    <MiniStateContainer onChange={() => {
                        startUpFunction();
                        getSchedule(data => { // api call
                            setAllTimeTables(data)
                        })
                    }} />
                    <div className='main-btn-container'>
                        <ButtonsContainer
                            onAutoFillBtnClick={() => {
                                setDisplayLoader(true)
                                generateTimeTable((data) => { // api call
                                    setAllTimeTables(data);
                                    setDisplayLoader(false)
                                }, () => { setDisplayLoader(false) })
                            }}
                            onFillManuallyBtnClick={() => {
                                fillManually.current = true;
                            }}
                        />
                        {timeTableStructure && <SectionsBtnContainer
                            currentOpenSection={currentOpenSection}
                            setCurrentOpenSection={setCurrentOpenSection}
                            noOfSections={timeTableStructure.sectionsPerSemester[currentOpenSem]} />}
                    </div>
                </div>

                {/* Year btns */}
                <HorizentalCardsContainer
                    // className='sem-cards-container'
                    // cardClassName={"semester-card"}
                    cardList={sems}
                    compressText={false}
                    cardClickHandler={semCardClickHandler} />

                {subjectsDetails && timeTableStructure && <TimeTable
                    className='class-time-table'
                    subjectsDetails={subjectsDetails}
                    details={timeTable}
                    periodClickHandler={(dayIndex: number, periodIndex: number) => {
                        if (!fillManually.current) return
                        setPeriodDetailsIndex([dayIndex, periodIndex]);
                        setShowPopUp(true)
                    }}
                    breakTimeIndexs={timeTableStructure.breaksPerSemester[currentOpenSem]}
                    noOfPeriods={Number(timeTableStructure.periodCount)} />}
                {!timeTable &&
                    (<div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
                        No Time Table Found for Year {currentOpenSem + 1} Sec {String.fromCharCode(65 + currentOpenSection)}
                    </div>)}
            </div>
            {subjectsDetails && <TeacherAndSubjectSelector
                active={showPopUp}
                onSetBtnClick={setBtnClickHandler}
                onCancelBtnClick={() => setShowPopUp(false)}
            />}
        </>
    )
}

interface ButtonsContainerProps {
    onAutoFillBtnClick?: () => void
    onFillManuallyBtnClick?: (value: string) => void
}

const ButtonsContainer: React.FC<ButtonsContainerProps> = memo(({ onAutoFillBtnClick, onFillManuallyBtnClick = () => { } }) => {
    const btnContainer = useRef<HTMLDivElement>(null)
    return (
        <div className='buttons-container' ref={btnContainer}>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} onClick={onAutoFillBtnClick}></Card>
            <Card details='Fill Manually' className='btn' compressText={false} onClick={onFillManuallyBtnClick}></Card>
        </div>
    )
})

interface SectionsBtnContainerProps {
    noOfSections: number
    currentOpenSection: number
    setCurrentOpenSection: (section: number) => void
}

const SectionsBtnContainer: React.FC<SectionsBtnContainerProps> = memo(({ noOfSections = 3, currentOpenSection, setCurrentOpenSection }) => {
    const sectionsBtnContainer = useRef<HTMLDivElement>(null)
    const sectionBtnsClickHandler = useCallback((val: string) => {
        setCurrentOpenSection(val.charCodeAt(0) - 65)
    }, [])

    let sectionBtns = [];
    for (let index = 0; index < noOfSections; index++) {
        let selectedClass = "";
        if (index === currentOpenSection)
            selectedClass = 'active';
        let char = String.fromCharCode(65 + index);
        sectionBtns.push(
            <Card
                details={char}
                key={index}
                className={'section-btn ' + selectedClass}
                active={selectedClass === 'active'}
                onClick={sectionBtnsClickHandler}
            />
        )
    }
    return (
        <div className='section-btn-container' ref={sectionsBtnContainer}>
            {sectionBtns}
        </div>
    )
})

interface TeacherAndSubjectSelectorProps {
    active: boolean
    onCancelBtnClick?: () => void
    onSetBtnClick?: (teacherList: string[], subjectList: string[]) => void
}

const TeacherAndSubjectSelector: React.FC<TeacherAndSubjectSelectorProps> = memo(({
    active = false,
    onCancelBtnClick = () => { },
    onSetBtnClick = () => { }
}) => {
    const teacherList = useRef<string[]>([])
    const subjectList = useRef<string[]>([])

    function onTeacherActive(list: string[] | undefined) {
        if (list)
            teacherList.current = list
    }
    function onSubjectActive(list: string[] | undefined) {
        if (list)
            subjectList.current = list
    }
    return (
        <>
            <div className={'teacher-subject-selector-container' + (active ? " active" : " ")}>
                <div className='teacher-subject-card-container'>
                    <TeacherCardsContainer onActive={onTeacherActive} />
                    <SubjectCardsContainer onActive={onSubjectActive} />
                </div>
                <div className='teacher-subject-selector-btns-container'>
                    <button onClick={() => onSetBtnClick(teacherList.current, subjectList.current)}>Set</button>
                    <button onClick={() => onCancelBtnClick()}>Cancel</button>
                </div>
            </div >
            <div className={'teacher-subject-selector-container-bg' + (active ? " active" : " ")}></div>
        </>
    )
})

interface TeacherCardsContainerProps {
    onActive: (activeCards: string[] | undefined) => void
}

const TeacherCardsContainer: React.FC<TeacherCardsContainerProps> = memo(({ onActive = () => { } }) => {
    const [teacherList, setTeacherList] = useState<string[]>()
    useEffect(() => {
        getTeachersList(setTeacherList) // api call
    }, [])
    return (
        <div className='teacher-cards-container'>
            <Cards
                cardClassName={"select-teacher-card"}
                cardList={teacherList}
                onAddBtnClick={() => {
                    window.location.href = window.location.origin + "/Teachers";
                }}
                canStayActiveMultipleCards={true}
                onActive={onActive} />
        </div>
    )
})

interface SubjectsCardsContainerProps {
    onActive: (activeCards: string[] | undefined) => void
}

const SubjectCardsContainer: React.FC<SubjectsCardsContainerProps> = memo(({ onActive = () => { } }) => {
    const [subjectsList, setSubjectsList] = useState<string[]>()
    useEffect(() => {
        getSubjectsList(setSubjectsList) // api call
    }, [])
    return (
        <div className='subject-cards-container'>
            <Cards
                cardClassName={"select-subject-card"}
                cardList={subjectsList}
                onAddBtnClick={() => {
                    window.location.href = window.location.origin + "/Subjects";
                }}
                onActive={onActive} />
        </div>
    )
})

export default memo(TimeTablesPage)
