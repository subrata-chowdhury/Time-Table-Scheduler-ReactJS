import MiniStateContainer from '../Components/MiniStateContainer';
import Menubar from '../Components/Menubar';
import TimeTable from '../Components/TimeTable';
import "../Style/TimeTablesPage.css";
import Cards, { Card, HorizentalCardsContainer } from '../Components/Cards';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getSubjectsList, getSubjectsDetailsList } from '../Script/SubjectsDataFetcher';
import { generateTimeTable, getSchedule, getTimeTableStructure, saveSchedule } from '../Script/TimeTableDataFetcher';
import { getTeachersList } from '../Script/TeachersDataFetcher';
import { emptyTimeTableDetails } from '../Components/TimeTable';
import "../Script/commonJS";
import OwnerFooter from '../Components/OwnerFooter';
import Loader from '../Components/Loader';
function TimeTablesPage() {
    return (<>
            <Menubar activeMenuIndex={3}/>
            <div className='main-container time-table'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>);
}
function MainComponents() {
    const [sems, setSems] = useState([]);
    const [subjectsDetails, setSubjectsDetails] = useState();
    const [allTimeTables, setAllTimeTables] = useState();
    const [timeTable, setTimeTable] = useState(emptyTimeTableDetails);
    const [currentOpenSem, setCurrentOpenSem] = useState(0);
    const [currentOpenSection, setCurrentOpenSection] = useState(0);
    const [displayLoader, setDisplayLoader] = useState(false);
    const [periodDetailsIndex, setPeriodDetailsIndex] = useState();
    const [timeTableStructure, setTimeTableStructure] = useState({
        breaksPerSemester: [[4, 5], [5], [5], [5]],
        periodCount: 9,
        sectionsPerSemester: [0, 0, 0, 0],
        semesterCount: 3
    });
    const [showPopUp, setShowPopUp] = useState(false);
    const fillManually = useRef(true);
    useEffect(() => {
        getSubjectsDetailsList(setSubjectsDetails); // api call
        getTimeTableStructure((data) => {
            if (data) {
                setTimeTableStructure(data);
                let sem = [];
                for (let index = 1; index <= data.semesterCount; index++) {
                    sem.push("Year " + index);
                }
                setSems(sem);
            }
        });
    }, []);
    const startUpFunction = useCallback(() => {
        try {
            if (allTimeTables)
                if (allTimeTables[currentOpenSem][currentOpenSection])
                    setTimeTable(allTimeTables[currentOpenSem][currentOpenSection]);
                else
                    setTimeTable(emptyTimeTableDetails);
        }
        catch (error) {
            console.log("%cError in selecting time table", "color: green");
        }
    }, [currentOpenSem, currentOpenSection, allTimeTables]);
    useEffect(() => {
        startUpFunction();
    }, [currentOpenSem, currentOpenSection, allTimeTables, startUpFunction]);
    useEffect(() => {
        getSchedule(data => {
            setAllTimeTables(data);
        });
    }, []);
    const semCardClickHandler = useCallback((value) => {
        let year = parseInt(value.slice(5));
        setCurrentOpenSem(year - 1);
    }, []);
    const setBtnClickHandler = useCallback((activeTeacherName, activeSubjectName) => {
        if (activeSubjectName.length > 0 && activeTeacherName.length > 0 && periodDetailsIndex) {
            let [dayIndex, periodIndex] = periodDetailsIndex;
            let newTimeTable = [...timeTable];
            if (newTimeTable[dayIndex] === null)
                return;
            newTimeTable[dayIndex][periodIndex] = [
                activeTeacherName.join("+"),
                activeSubjectName[0],
                (subjectsDetails && subjectsDetails[activeSubjectName[0]]) ?
                    subjectsDetails[activeSubjectName[0]].roomCodes[0] : ""
            ];
            newTimeTable ? setTimeTable(newTimeTable) : "";
            saveSchedule(currentOpenSem, currentOpenSection, newTimeTable, () => setShowPopUp(false)); // api call
        }
    }, [subjectsDetails, periodDetailsIndex, timeTable]);
    return (<>
            <div className='top-sub-container'>
                <div className='menubar'>
                    <MiniStateContainer onChange={() => {
            startUpFunction();
            getSchedule(data => {
                setAllTimeTables(data);
            });
        }}/>
                    <div className='main-btn-container'>
                        <ButtonsContainer onAutoFillBtnClick={() => {
            setDisplayLoader(true);
            generateTimeTable((data) => {
                setAllTimeTables(data);
                setDisplayLoader(false);
            }, () => { setDisplayLoader(false); });
        }} onFillManuallyBtnClick={() => {
            fillManually.current = true;
        }}/>
                        {timeTableStructure && <SectionsBtnContainer currentOpenSection={currentOpenSection} setCurrentOpenSection={setCurrentOpenSection} noOfSections={timeTableStructure.sectionsPerSemester[currentOpenSem]}/>}
                    </div>
                </div>

                {/* Year btns */}
                <HorizentalCardsContainer 
    // className='sem-cards-container'
    // cardClassName={"semester-card"}
    cardList={sems} compressText={false} onCardClick={semCardClickHandler}/>

                {subjectsDetails && timeTableStructure && <TimeTable className='class-time-table' subjectsDetails={subjectsDetails} details={timeTable} periodClickHandler={(dayIndex, periodIndex) => {
                if (!fillManually.current)
                    return;
                setPeriodDetailsIndex([dayIndex, periodIndex]);
                setShowPopUp(true);
            }} breakTimeIndexs={timeTableStructure.breaksPerSemester[currentOpenSem]} noOfPeriods={Number(timeTableStructure.periodCount)}/>}
                {!timeTable &&
            (<div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
                        No Time Table Found for Year {currentOpenSem + 1} Sec {String.fromCharCode(65 + currentOpenSection)}
                    </div>)}
            </div>
            {subjectsDetails && <TeacherAndSubjectSelector active={showPopUp} onSetBtnClick={setBtnClickHandler} onCancelBtnClick={() => setShowPopUp(false)}/>}
            {displayLoader && <Loader />}
        </>);
}
const ButtonsContainer = memo(({ onAutoFillBtnClick, onFillManuallyBtnClick = () => { } }) => {
    const btnContainer = useRef(null);
    return (<div className='buttons-container' ref={btnContainer}>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} onClick={onAutoFillBtnClick}></Card>
            <Card details='Fill Manually' className='btn' compressText={false} onClick={onFillManuallyBtnClick}></Card>
        </div>);
});
const SectionsBtnContainer = memo(({ noOfSections = 3, currentOpenSection, setCurrentOpenSection }) => {
    const sectionsBtnContainer = useRef(null);
    const sectionBtnsClickHandler = useCallback((val) => {
        setCurrentOpenSection(val.charCodeAt(0) - 65);
    }, []);
    let sectionBtns = [];
    for (let index = 0; index < noOfSections; index++) {
        let selectedClass = "";
        if (index === currentOpenSection)
            selectedClass = 'active';
        let char = String.fromCharCode(65 + index);
        sectionBtns.push(<Card details={char} key={index} className={'section-btn ' + selectedClass} active={selectedClass === 'active'} onClick={sectionBtnsClickHandler}/>);
    }
    return (<div className='section-btn-container' ref={sectionsBtnContainer}>
            {sectionBtns}
        </div>);
});
const TeacherAndSubjectSelector = memo(({ active = false, onCancelBtnClick = () => { }, onSetBtnClick = () => { } }) => {
    const teacherList = useRef([]);
    const subjectList = useRef([]);
    function onTeacherActive(list) {
        if (list)
            teacherList.current = list;
    }
    function onSubjectActive(list) {
        if (list)
            subjectList.current = list;
    }
    return (<>
            <div className={'teacher-subject-selector-container' + (active ? " active" : " ")}>
                <div className='teacher-subject-card-container'>
                    <TeacherCardsContainer onActive={onTeacherActive}/>
                    <SubjectCardsContainer onActive={onSubjectActive}/>
                </div>
                <div className='teacher-subject-selector-btns-container'>
                    <button onClick={() => onSetBtnClick(teacherList.current, subjectList.current)}>SET</button>
                    <button onClick={() => onCancelBtnClick()}>Cancel</button>
                </div>
            </div>
            <div className={'teacher-subject-selector-container-bg' + (active ? " active" : " ")}></div>
        </>);
});
const TeacherCardsContainer = memo(({ onActive = () => { } }) => {
    const [teacherList, setTeacherList] = useState();
    useEffect(() => {
        getTeachersList(setTeacherList); // api call
    }, []);
    return (<div className='teacher-cards-container'>
            <Cards cardClassName={"select-teacher-card"} cardList={teacherList} onAddBtnClick={() => {
            window.location.href = window.location.origin + "/Teachers";
        }} canStayActiveMultipleCards={true} onActive={onActive}/>
        </div>);
});
const SubjectCardsContainer = memo(({ onActive = () => { } }) => {
    const [subjectsList, setSubjectsList] = useState();
    useEffect(() => {
        getSubjectsList(setSubjectsList); // api call
    }, []);
    return (<div className='subject-cards-container'>
            <Cards cardClassName={"select-subject-card"} cardList={subjectsList} onAddBtnClick={() => {
            window.location.href = window.location.origin + "/Subjects";
        }} onActive={onActive}/>
        </div>);
});
export default memo(TimeTablesPage);
