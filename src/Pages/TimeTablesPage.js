import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'
import "../Style/TimeTablesPage.css"
import Cards, { Card, HorizentalCardsContainer } from '../Components/Cards'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getSubjects } from '../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule, getTimeTableStructure } from '../Script/TimeTableDataFetcher'
import { getTeacherList } from '../Script/TeachersDataFetcher'
import { emptyTimeTableDetails } from '../Components/TimeTable'
import "../Script/commonJS"
import { hasElement } from '../Script/util'

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
        sectionsPerSemester: [0,0,3,0],
        semesterCount: 4
    })
    const [fillManually, setFillManually] = useState(false)
    useEffect(() => {
        getSubjects(setSubjectsDetails)
        getTeacherList(setTeacherList)
        getTimeTableStructure((data) => {
            setTimeTableStructure(data)
            let sem = []
            for (let index = 1; index <= data.semesterCount; index++) {
                sem.push("Year " + index);
            }
            setSems(sem);
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
    function setBtnClickListener() {
        let teacherCard = document.querySelectorAll(".select-teacher-card.active");
        let subjectCard = document.querySelector(".select-subject-card.active");
        let periodDetails = { ...period }
        if (teacherCard) {
            periodDetails.teacherName = [];
            for (let index = 0; index < teacherCard.length; index++) {
                periodDetails.teacherName.push(teacherCard[index].title);
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
        document.querySelector(".teacher-subject-selector-container button:nth-child(2)").click()
    }
    return (
        <>
            <Loader display={displayLoader} />
            <Menubar activeMenuIndex={3} />
            <div className='main-container time-table'>
                <div className='menubar'>
                    <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                    <div className='main-btn-container'>
                        <ButtonsContainer setAllTimeTables={setAllTimeTables} setDisplayLoader={setDisplayLoader} setFillManually={setFillManually} />
                        {timeTableStructure && <SectionsBtnContainer
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
                            document.querySelector(".teacher-subject-selector-container").classList.add("active");
                            document.querySelector(".teacher-subject-selector-container-bg").classList.add("active");
                        } catch (err) { }
                    }}
                    breakTimeIndexs={timeTableStructure.breaksPerSemester[currentOpenSem]}
                    noOfPeriods={timeTableStructure.periodCount} />}
                {!timeTable &&
                    (<div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
                        No Time Table Found for Year {currentOpenSem + 1} Sec {String.fromCharCode(65 + currentOpenSection)}
                    </div>)}
            </div>
            {subjectsDetails && teacherList && <TeacherAndSubjectSelector
                teacherCardDetails={teacherList}
                subjectCardDetails={subjectsDetails}
                setBtnClickListener={setBtnClickListener}
            />}
        </>
    )
}

function ButtonsContainer({ setAllTimeTables, setDisplayLoader, setFillManually }) {
    function autoFillBtnClickHandler() {
        setDisplayLoader(true)
        generateTimeTable((data) => {
            setAllTimeTables(data)
            setDisplayLoader(false)
        })
    }
    function fillManuallyBtnClickHandler(event) {
        let currentTargetClasses = event.currentTarget.classList;
        let found = hasElement(currentTargetClasses,"active")
        if(found) setFillManually(false)
        else setFillManually(true)
    }
    return (
        <div className='buttons-container'>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} cardClickHandler={autoFillBtnClickHandler} ></Card>
            <Card details='Fill Manually' className='btn' compressText={false} cardClickHandler={fillManuallyBtnClickHandler} ></Card>
        </div>
    )
}

function SectionsBtnContainer({ noOfSections = 3, setCurrentOpenSection }) {
    let sectionBtns = [];
    for (let index = 0; index < noOfSections; index++) {
        let char = String.fromCharCode(65 + index);
        sectionBtns.push(
            <Card
                details={char}
                key={index}
                className='section-btn'
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
    setBtnClickListener = () => { }
}) {
    const teacherSubjectPopUp = useRef();
    const teacherSubjectPopUpBg = useRef();
    function closeTeacherAndSubjectPopUp() {
        teacherSubjectPopUp.current.classList.remove("active")
        teacherSubjectPopUpBg.current.classList.remove("active")
    }
    return (
        <>
            <div className='teacher-subject-selector-container' ref={teacherSubjectPopUp}>
                <div className='teacher-subject-card-container'>
                    <TeacherCardsContainer cardDetails={teacherCardDetails} />
                    <SubjectCardsContainer cardDetails={Object.keys(subjectCardDetails)} />
                </div>
                <div className='teacher-subject-selector-btns-container'>
                    <button onClick={setBtnClickListener}>Set</button>
                    <button onClick={closeTeacherAndSubjectPopUp}>Cancel</button>
                </div>
            </div>
            <div className='teacher-subject-selector-container-bg' ref={teacherSubjectPopUpBg}></div>
        </>
    )
}

function TeacherCardsContainer({ cardDetails = [] }) {
    return (
        <div className='teacher-cards-container'>
            <Cards cardClassName={"select-teacher-card"} cardDetails={cardDetails} addBtnClickHandler={() => {
                window.location.href = window.location.origin + "/Teachers";
            }} canStayActiveMultipleCards={true} />
        </div>
    )
}
function SubjectCardsContainer({ cardDetails = [] }) {
    return (
        <div className='subject-cards-container'>
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