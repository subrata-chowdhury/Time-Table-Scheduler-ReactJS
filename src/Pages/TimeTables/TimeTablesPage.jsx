import MiniStateContainer from '../../Components/MiniStateContainer';
import TimeTable from '../../Components/TimeTable';
import "../../Style/Pages/TimeTablesPage.css";
import { HorizentalCardsContainer } from '../../Components/Cards';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getSubjectsDetailsList } from '../../Script/SubjectsDataFetcher';
import { generateTimeTable, getSchedule, getTimeTableStructure, saveSchedule } from '../../Script/TimeTableDataFetcher';
import { emptyTimeTableDetails } from '../../Components/TimeTable';
import Loader from '../../Components/Loader';
import TeacherAndSubjectSelector from './TeacherAndSubjectSelector';
import { ButtonsContainer, SectionsBtnContainer } from './Header';

function TimeTablesPage() {
    return (
        <>
            <div className='page time-table'>
                <MainComponents />
            </div>
        </>
    );
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
            saveSchedule(currentOpenSem + 1, currentOpenSection + 1, newTimeTable, () => setShowPopUp(false)); // api call
        }
    }, [subjectsDetails, periodDetailsIndex, timeTable]);

    return (
        <>
            <div className='top-sub-container'>
                <div className='menubar'>
                    <MiniStateContainer onChange={() => {
                        startUpFunction();
                        getSchedule(data => {
                            setAllTimeTables(data);
                        });
                    }} />
                    <div className='main-btn-container'>
                        <ButtonsContainer onAutoFillBtnClick={() => {
                            setDisplayLoader(true);
                            generateTimeTable((data) => {
                                setAllTimeTables(data);
                                setDisplayLoader(false);
                            }, () => { setDisplayLoader(false); });
                        }} onFillManuallyBtnClick={() => {
                            fillManually.current = true;
                        }} />
                        {timeTableStructure && <SectionsBtnContainer
                            currentOpenSection={currentOpenSection}
                            setCurrentOpenSection={setCurrentOpenSection}
                            noOfSections={timeTableStructure.sectionsPerSemester[currentOpenSem]} />}
                    </div>
                </div>

                {/* Year btns */}
                <HorizentalCardsContainer cardList={sems} onCardClick={semCardClickHandler} />

                {subjectsDetails && timeTableStructure && <TimeTable
                    className='class-time-table'
                    subjectsDetails={subjectsDetails}
                    details={timeTable}
                    periodClickHandler={(dayIndex, periodIndex) => {
                        if (!fillManually.current)
                            return;
                        setPeriodDetailsIndex([dayIndex, periodIndex]);
                        setShowPopUp(true);
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
                onCancelBtnClick={() => setShowPopUp(false)} />}
            {displayLoader && <Loader />}
        </>
    );
}

export default memo(TimeTablesPage);
