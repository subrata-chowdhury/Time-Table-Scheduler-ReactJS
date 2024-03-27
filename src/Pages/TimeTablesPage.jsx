import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'
import "../Style/TimeTablesPage.css"
import Cards, { Card, HorizentalCardsContainer } from '../Components/Cards'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getSubjects } from '../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule, getTimeTableStructure, saveSchedule } from '../Script/TimeTableDataFetcher'
import { getTeacherList } from '../Script/TeachersDataFetcher'
import { emptyTimeTableDetails } from '../Components/TimeTable'
import "../Script/commonJS"
import { hasElement } from '../Script/util'
import OwnerFooter from '../Components/OwnerFooter'

function TimeTablesPage() {
    const [sems, setSems] = useState([])
    const [subjectsDetails, setSubjectsDetails] = useState()
    const [allTimeTables, setAllTimeTables] = useState()
    const [timeTable, setTimeTable] = useState(emptyTimeTableDetails)
    const [currentOpenSem, setCurrentOpenSem] = useState(0)
    const [currentOpenSection, setCurrentOpenSection] = useState(0)
    const [displayLoader, setDisplayLoader] = useState(false)
    const [teacherList, setTeacherList] = useState()
    const [period, setPeriod] = useState({
        teacherName: "",
        subjectName: "",
        roomCode: ""
    })
    const [periodDetailsIndex, setPeriodDetailsIndex] = useState()
    const [timeTableStructure, setTimeTableStructure] = useState({
        breaksPerSemester: [4],
        periodCount: 9,
        sectionsPerSemester: [0, 0, 3, 0],
        semesterCount: 4
    })
    const [fillManually, setFillManually] = useState(false)

    const teacherSubjectPopUp = useRef();
    const teacherSubjectPopUpBg = useRef();

    useEffect(() => {
        getSubjects(setSubjectsDetails)
        getTeacherList(setTeacherList)
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
    let startUpFunction = useCallback(() => {
        getSchedule((data) => {
            try {
                if (data[currentOpenSem][currentOpenSection])
                    setTimeTable(data[currentOpenSem][currentOpenSection])
                else setTimeTable(emptyTimeTableDetails);
            } catch (error) {
                alert("Error in selecting time table")
            }
        })
    }, [currentOpenSem, currentOpenSection])
    useEffect(() => {
        startUpFunction()
    }, [currentOpenSem, currentOpenSection, allTimeTables, startUpFunction])

    function semCardClickHandler(event) {
        let year = parseInt(event.target.title.slice(5))
        setCurrentOpenSem(year - 1)
    }
    function setBtnClickListener(teacherCardsContainer, subjectCardsContainer, closeTeacherAndSubjectPopUp) {
        let teacherCards = teacherCardsContainer.querySelectorAll(".select-teacher-card.active");
        let subjectCard = subjectCardsContainer.querySelector(".select-subject-card.active");
        let periodDetails = { ...period }
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
        setPeriod(periodDetails)
        let newTT = [...timeTable]
        let dayIndex = periodDetailsIndex[0]
        let periodIndex = periodDetailsIndex[1]
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
    }
    return (
        <>
            <Loader display={displayLoader} />
            <Menubar activeMenuIndex={3} />
            <div className='main-container time-table'>
                <div className='top-sub-container'>
                    <div className='menubar'>
                        <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                        <div className='main-btn-container'>
                            <ButtonsContainer setAllTimeTables={setAllTimeTables} setDisplayLoader={setDisplayLoader} setFillManually={setFillManually} />
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
                            if (!fillManually) return
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
                <OwnerFooter />
            </div>
            {subjectsDetails && teacherList && <TeacherAndSubjectSelector
                teacherCardDetails={teacherList}
                subjectCardDetails={subjectsDetails}
                setBtnClickListener={setBtnClickListener}
                teacherSubjectPopUpRef={teacherSubjectPopUp}
                teacherSubjectPopUpBgRef={teacherSubjectPopUpBg}
            />}
        </>
    )
}

function ButtonsContainer({ setAllTimeTables, setDisplayLoader, setFillManually }) {
    function autoFillBtnClickHandler() {
        setDisplayLoader(true)
        generateTimeTable((data) => {
            setAllTimeTables(data);
            setDisplayLoader(false)
        }, () => { setDisplayLoader(false) })
    }
    function fillManuallyBtnClickHandler(event) {
        let currentTargetClasses = event.currentTarget.classList;
        let found = hasElement(currentTargetClasses, "active")
        if (found) setFillManually(false)
        else setFillManually(true)
    }
    const btnContainer = useRef()
    return (
        <div className='buttons-container' ref={btnContainer}>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} cardClickHandler={autoFillBtnClickHandler} cardsContainerRefCurrent={btnContainer.current} ></Card>
            <Card details='Fill Manually' className='btn' compressText={false} cardClickHandler={fillManuallyBtnClickHandler} cardsContainerRefCurrent={btnContainer.current} ></Card>
        </div>
    )
}

function SectionsBtnContainer({ noOfSections = 3, currentOpenSection, setCurrentOpenSection }) {
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
                cardClickHandler={sectionBtnsClickHandler} />
        )
    }
    function sectionBtnsClickHandler(event) {
        setCurrentOpenSection(event.target.title.charCodeAt(0) - 65)
    }
    return (
        <div className='section-btn-container'>
            {sectionBtns}
        </div>
    )
}

function TeacherAndSubjectSelector({
    teacherCardDetails = [],
    subjectCardDetails = [],
    setBtnClickListener = () => { },
    teacherSubjectPopUpRef,
    teacherSubjectPopUpBgRef
}) {
    const teacherCardsContainer = useRef();
    const subjectCardsContainer = useRef();
    function closeTeacherAndSubjectPopUp() {
        teacherSubjectPopUpRef.current.classList.remove("active")
        teacherSubjectPopUpBgRef.current.classList.remove("active")
    }
    return (
        <>
            <div className='teacher-subject-selector-container' ref={teacherSubjectPopUpRef}>
                <div className='teacher-subject-card-container'>
                    <TeacherCardsContainer cardDetails={teacherCardDetails} teacherCardsContainerRef={teacherCardsContainer} />
                    <SubjectCardsContainer cardDetails={Object.keys(subjectCardDetails)} subjectCardsContainerRef={subjectCardsContainer} />
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
}

function TeacherCardsContainer({ cardDetails = [], teacherCardsContainerRef = "" }) {
    return (
        <div className='teacher-cards-container' ref={teacherCardsContainerRef}>
            <Cards cardClassName={"select-teacher-card"} cardDetails={cardDetails} addBtnClickHandler={() => {
                window.location.href = window.location.origin + "/Teachers";
            }} canStayActiveMultipleCards={true} />
        </div>
    )
}
function SubjectCardsContainer({ cardDetails = [], subjectCardsContainerRef = "" }) {
    return (
        <div className='subject-cards-container' ref={subjectCardsContainerRef}>
            <Cards cardClassName={"select-subject-card"} cardDetails={cardDetails} addBtnClickHandler={() => {
                window.location.href = window.location.origin + "/Subjects";
            }} />
        </div>
    )
}

function Loader({ display = false }) {
    let loaderDisplayStyle = {
        display: (display ? "block" : "none")
    }
    return (
        <div className='loader' style={loaderDisplayStyle}>
            <div className='outer-circle'></div>
            <div className='inner-circle'></div>
        </div>
    )
}

export default TimeTablesPage
