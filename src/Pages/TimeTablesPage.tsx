import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import TimeTable from '../Components/TimeTable.tsx'
import "../Style/TimeTablesPage.css"
import Cards, { Card, HorizentalCardsContainer } from '../Components/Cards.tsx'
import { LegacyRef, memo, useCallback, useEffect, useRef, useState } from 'react'
import { getSubjectsList, getSubjectsDetailsList, SubjectsDetailsList } from '../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule, getTimeTableStructure } from '../Script/TimeTableDataFetcher'
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
    const fillManually = useRef(false)

    const teacherSubjectPopUp = useRef<HTMLDivElement>(null);
    const teacherSubjectPopUpBg = useRef<HTMLDivElement>(null);

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
    const setBtnClickListener = useCallback((teacherCardsContainer: HTMLDivElement, subjectCardsContainer: HTMLDivElement, closeTeacherAndSubjectPopUp: () => void) => {
        let teacher = teacherCardsContainer.querySelector(".active")?.textContent
        let subject = subjectCardsContainer.querySelector(".active")?.textContent
        if (teacher && subject && periodDetailsIndex) {
            let [dayIndex, periodIndex] = periodDetailsIndex
            let newTimeTable = [...timeTable]
            if (newTimeTable[dayIndex] === null) return
            newTimeTable[dayIndex][periodIndex] = [teacher, subject, ""]
            // newTimeTable ? setTimeTable(newTimeTable) : ""
            // saveSchedule(sem) // api call
            closeTeacherAndSubjectPopUp()
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
                        <ButtonsContainer setAllTimeTables={setAllTimeTables} setDisplayLoader={setDisplayLoader} fillManually={fillManually} />
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
                        try {
                            if (teacherSubjectPopUp.current && teacherSubjectPopUpBg.current) {
                                teacherSubjectPopUp.current.classList.add("active");
                                teacherSubjectPopUpBg.current.classList.add("active");
                            }
                        } catch (err) { }
                    }}
                    breakTimeIndexs={timeTableStructure.breaksPerSemester[currentOpenSem]}
                    noOfPeriods={Number(timeTableStructure.periodCount)} />}
                {!timeTable &&
                    (<div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
                        No Time Table Found for Year {currentOpenSem + 1} Sec {String.fromCharCode(65 + currentOpenSection)}
                    </div>)}
            </div>
            {subjectsDetails && <TeacherAndSubjectSelector
                setBtnClickListener={setBtnClickListener}
                teacherSubjectPopUpRef={teacherSubjectPopUp}
                teacherSubjectPopUpBgRef={teacherSubjectPopUpBg}
            />}
        </>
    )
}

interface ButtonsContainerProps {
    setAllTimeTables: (data: FullTimeTable) => void
    setDisplayLoader: (val: boolean) => void
    fillManually?: React.MutableRefObject<boolean>
}

const ButtonsContainer: React.FC<ButtonsContainerProps> = memo(({ setAllTimeTables, setDisplayLoader, fillManually = useRef<boolean>(false) }) => {
    const autoFillBtnClickHandler = useCallback(() => {
        setDisplayLoader(true)
        generateTimeTable((data) => { // api call
            setAllTimeTables(data);
            setDisplayLoader(false)
        }, () => { setDisplayLoader(false) })
    }, [])
    const fillManuallyBtnClickHandler = useCallback((value: string) => {
        let found = (value === "Fill Manually")
        if (found) fillManually.current = false
        else fillManually.current = true
    }, [])
    const btnContainer = useRef<HTMLDivElement>(null)
    return (
        <div className='buttons-container' ref={btnContainer}>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} onClick={autoFillBtnClickHandler}></Card>
            <Card details='Fill Manually' className='btn' compressText={false} onClick={fillManuallyBtnClickHandler}></Card>
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
    setBtnClickListener: (teacherCardsContainer: HTMLDivElement, subjectCardsContainer: HTMLDivElement, closeTeacherAndSubjectPopUp: () => void) => void
    teacherSubjectPopUpRef: React.RefObject<HTMLDivElement>
    teacherSubjectPopUpBgRef: React.RefObject<HTMLDivElement>
}

const TeacherAndSubjectSelector: React.FC<TeacherAndSubjectSelectorProps> = memo(({
    setBtnClickListener = () => { },
    teacherSubjectPopUpRef,
    teacherSubjectPopUpBgRef
}) => {
    const teacherCardsContainer = useRef<HTMLDivElement>(null);
    const subjectCardsContainer = useRef<HTMLDivElement>(null);
    const closeTeacherAndSubjectPopUp = useCallback(() => {
        if (teacherSubjectPopUpRef.current && teacherSubjectPopUpBgRef.current) {
            teacherSubjectPopUpRef.current.classList.remove("active")
            teacherSubjectPopUpBgRef.current.classList.remove("active")
        }
    }, [])
    return (
        <>
            <div className='teacher-subject-selector-container' ref={teacherSubjectPopUpRef}>
                <div className='teacher-subject-card-container'>
                    <TeacherCardsContainer teacherCardsContainerRef={teacherCardsContainer} />
                    <SubjectCardsContainer subjectCardsContainerRef={subjectCardsContainer} />
                </div>
                <div className='teacher-subject-selector-btns-container'>
                    <button onClick={() => {
                        if (teacherCardsContainer.current && subjectCardsContainer.current)
                            setBtnClickListener(teacherCardsContainer.current, subjectCardsContainer.current, closeTeacherAndSubjectPopUp)
                    }}>Set</button>
                    <button onClick={closeTeacherAndSubjectPopUp}>Cancel</button>
                </div>
            </div>
            <div className='teacher-subject-selector-container-bg' ref={teacherSubjectPopUpBgRef}></div>
        </>
    )
})

interface TeacherCardsContainerProps {
    teacherCardsContainerRef: React.RefObject<HTMLDivElement>
}

const TeacherCardsContainer: React.FC<TeacherCardsContainerProps> = memo(({ teacherCardsContainerRef }) => {
    const [teacherList, setTeacherList] = useState<string[]>()
    useEffect(() => {
        getTeachersList(setTeacherList) // api call
    }, [])
    return (
        <div className='teacher-cards-container' ref={teacherCardsContainerRef}>
            <Cards cardClassName={"select-teacher-card"} cardList={teacherList} onAddBtnClick={() => {
                window.location.href = window.location.origin + "/Teachers";
            }} canStayActiveMultipleCards={true} />
        </div>
    )
})

interface SubjectsCardsContainerProps {
    subjectCardsContainerRef: LegacyRef<HTMLDivElement>
}

const SubjectCardsContainer: React.FC<SubjectsCardsContainerProps> = memo(({ subjectCardsContainerRef }) => {
    const [subjectsList, setSubjectsList] = useState<string[]>()
    useEffect(() => {
        getSubjectsList(setSubjectsList) // api call
    }, [])
    return (
        <div className='subject-cards-container' ref={subjectCardsContainerRef}>
            <Cards cardClassName={"select-subject-card"} cardList={subjectsList} onAddBtnClick={() => {
                window.location.href = window.location.origin + "/Subjects";
            }} />
        </div>
    )
})

export default memo(TimeTablesPage)
