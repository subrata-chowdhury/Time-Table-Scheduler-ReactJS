import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'
import "../Style/TimeTablesPage.css"
import Cards, { Card, HorizentalCardsContainer } from '../Components/Cards'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getSubjectList, getSubjects } from '../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule, getTimeTableStructure, saveSchedule } from '../Script/TimeTableDataFetcher'
import { getTeacherList } from '../Script/TeachersDataFetcher'
import { emptyTimeTableDetails } from '../Components/TimeTable'
import "../Script/commonJS"
import { hasElement } from '../Script/util'
import OwnerFooter from '../Components/OwnerFooter'
import Loader from '../Components/Loader'

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
    const [sems, setSems] = useState([])
    const [subjectsDetails, setSubjectsDetails] = useState()
    const [allTimeTables, setAllTimeTables] = useState()
    const [timeTable, setTimeTable] = useState(emptyTimeTableDetails)
    const [currentOpenSem, setCurrentOpenSem] = useState(0)
    const [currentOpenSection, setCurrentOpenSection] = useState(0)
    const [displayLoader, setDisplayLoader] = useState(false)
    const [periodDetailsIndex, setPeriodDetailsIndex] = useState()
    const [timeTableStructure, setTimeTableStructure] = useState({
        breaksPerSemester: [4],
        periodCount: 9,
        sectionsPerSemester: [0, 0, 3, 0],
        semesterCount: 4
    })
    const fillManually = useRef(false)

    const teacherSubjectPopUp = useRef();
    const teacherSubjectPopUpBg = useRef();

    useEffect(() => {
        getSubjects(setSubjectsDetails)
        getTimeTableStructure((data) => {
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
        getSchedule(data => {
            setAllTimeTables(data)
        })
    }, [])

    const semCardClickHandler = useCallback((event) => {
        let year = parseInt(event.target.title.slice(5))
        setCurrentOpenSem(year - 1)
    }, [])
    const setBtnClickListener = useCallback((teacherCardsContainer, subjectCardsContainer, closeTeacherAndSubjectPopUp) => {
        let teacherCards = teacherCardsContainer.querySelectorAll(".select-teacher-card.active");
        let subjectCard = subjectCardsContainer.querySelector(".select-subject-card.active");
        if (!subjectCard) {
            alert("At least select a subject")
            return
        }
        let dayIndex = periodDetailsIndex[0]
        let periodIndex = periodDetailsIndex[1]
        let periodDetails = { ...timeTable[dayIndex][periodIndex] }
        if (teacherCards) {
            periodDetails.teacherName = [];
            for (let index = 0; index < teacherCards.length; index++) {
                periodDetails.teacherName.push(teacherCards[index].title);
            }
            periodDetails.teacherName = periodDetails.teacherName.join("+")
        } else {
            periodDetails.teacherName = "";
        }
        if (subjectCard) {
            periodDetails.subjectName = subjectCard.title;
        } else {
            periodDetails.subjectName = subjectCard.title;
        }
        if (subjectsDetails) {
            periodDetails.roomCode = subjectsDetails[periodDetails.subjectName].roomCodes.join(",");
        } else {
            periodDetails.roomCode = ""
        }
        let newTT = [...timeTable]
        let subjectTypeBeforeUpdate = false;
        try {
            subjectTypeBeforeUpdate = subjectsDetails[timeTable[dayIndex][periodIndex][1]].isPractical;
        } catch (err) { }
        if (subjectsDetails[periodDetails.subjectName].isPractical) {
            newTT[dayIndex][periodIndex] = [periodDetails.teacherName, periodDetails.subjectName, periodDetails.roomCode]
            newTT[dayIndex][++periodIndex] = [periodDetails.teacherName, periodDetails.subjectName, periodDetails.roomCode]
            newTT[dayIndex][++periodIndex] = [periodDetails.teacherName, periodDetails.subjectName, periodDetails.roomCode]
        } else {
            if (subjectTypeBeforeUpdate === true) {
                newTT[dayIndex][periodIndex] = [periodDetails.teacherName, periodDetails.subjectName, periodDetails.roomCode]
                newTT[dayIndex][++periodIndex] = [null, null, null]
                newTT[dayIndex][++periodIndex] = [null, null, null]
            } else
                newTT[dayIndex][periodIndex] = [periodDetails.teacherName, periodDetails.subjectName, periodDetails.roomCode]
        }
        setTimeTable(newTT)
        // getSchedule((data)=>{
        //     data[currentOpenSem][currentOpenSection] = newTT;
        //     console.log(data)
        //     saveSchedule(data);
        // })
        closeTeacherAndSubjectPopUp();
    }, [subjectsDetails, periodDetailsIndex, timeTable])
    return (
        <>
            <Loader display={displayLoader} />
            <div className='top-sub-container'>
                <div className='menubar'>
                    <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                    <div className='main-btn-container'>
                        <ButtonsContainer setAllTimeTables={setAllTimeTables} setDisplayLoader={setDisplayLoader} fillManually={fillManually} />
                        {timeTableStructure && <SectionsBtnContainer
                            currentOpenSection={currentOpenSection}
                            setCurrentOpenSection={setCurrentOpenSection}
                            noOfSections={timeTableStructure.sectionsPerSemester[currentOpenSem]} />}
                    </div>
                </div>
                <HorizentalCardsContainer
                    className='sem-cards-container'
                    cardClassName={"semester-card"}
                    cardData={sems}
                    compressText={false}
                    cardClickHandler={semCardClickHandler} />

                {subjectsDetails && timeTableStructure && <TimeTable
                    subjectsDetails={subjectsDetails}
                    details={timeTable}
                    periodClickHandler={(event) => {
                        if (!fillManually.current) return
                        setPeriodDetailsIndex([event.currentTarget.dataset.day, event.currentTarget.dataset.period]);
                        try {
                            teacherSubjectPopUp.current.classList.add("active");
                            teacherSubjectPopUpBg.current.classList.add("active");
                        } catch (err) { }
                    }}
                    breakTimeIndexs={timeTableStructure.breaksPerSemester[currentOpenSem]}
                    noOfPeriods={timeTableStructure.periodCount} />}
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

const ButtonsContainer = memo(({ setAllTimeTables, setDisplayLoader, fillManually }) => {
    const autoFillBtnClickHandler = useCallback(() => {
        setDisplayLoader(true)
        generateTimeTable((data) => {
            setAllTimeTables(data);
            setDisplayLoader(false)
        }, () => { setDisplayLoader(false) })
    }, [])
    const fillManuallyBtnClickHandler = useCallback((event) => {
        let currentTargetClasses = event.currentTarget.classList;
        let found = hasElement(currentTargetClasses, "active")
        if (found) fillManually.current = false
        else fillManually.current = true
    }, [])
    const btnContainer = useRef()
    return (
        <div className='buttons-container' ref={btnContainer}>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} cardClickHandler={autoFillBtnClickHandler} cardsContainer={btnContainer} ></Card>
            <Card details='Fill Manually' className='btn' compressText={false} cardClickHandler={fillManuallyBtnClickHandler} cardsContainer={btnContainer} ></Card>
        </div>
    )
})

const SectionsBtnContainer = memo(({ noOfSections = 3, currentOpenSection, setCurrentOpenSection }) => {
    const sectionsBtnContainer = useRef()
    const sectionBtnsClickHandler = useCallback((event) => {
        setCurrentOpenSection(event.target.title.charCodeAt(0) - 65)
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
                cardClickHandler={sectionBtnsClickHandler}
                cardsContainer={sectionsBtnContainer} />
        )
    }
    return (
        <div className='section-btn-container' ref={sectionsBtnContainer}>
            {sectionBtns}
        </div>
    )
})

const TeacherAndSubjectSelector = memo(({
    setBtnClickListener = () => { },
    teacherSubjectPopUpRef,
    teacherSubjectPopUpBgRef
}) => {
    const teacherCardsContainer = useRef();
    const subjectCardsContainer = useRef();
    const closeTeacherAndSubjectPopUp = useCallback(() => {
        teacherSubjectPopUpRef.current.classList.remove("active")
        teacherSubjectPopUpBgRef.current.classList.remove("active")
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
                        setBtnClickListener(teacherCardsContainer.current, subjectCardsContainer.current, closeTeacherAndSubjectPopUp)
                    }}>Set</button>
                    <button onClick={closeTeacherAndSubjectPopUp}>Cancel</button>
                </div>
            </div>
            <div className='teacher-subject-selector-container-bg' ref={teacherSubjectPopUpBgRef}></div>
        </>
    )
})

const TeacherCardsContainer = memo(({ teacherCardsContainerRef = useRef() }) => {
    const [teacherList, setTeacherList] = useState()
    useEffect(() => {
        getTeacherList(setTeacherList)
    }, [])
    return (
        <div className='teacher-cards-container' ref={teacherCardsContainerRef}>
            <Cards cardClassName={"select-teacher-card"} cardDetails={teacherList} addBtnClickHandler={() => {
                window.location.href = window.location.origin + "/Teachers";
            }} canStayActiveMultipleCards={true} />
        </div>
    )
})
const SubjectCardsContainer = memo(({ subjectCardsContainerRef = useRef() }) => {
    const [subjectsList, setSubjectsList] = useState()
    useEffect(() => {
        getSubjectList(setSubjectsList)
    }, [])
    return (
        <div className='subject-cards-container' ref={subjectCardsContainerRef}>
            <Cards cardClassName={"select-subject-card"} cardDetails={subjectsList} addBtnClickHandler={() => {
                window.location.href = window.location.origin + "/Subjects";
            }} />
        </div>
    )
})

export default memo(TimeTablesPage)
