import MiniStateContainer from '../../Components/MiniStateContainer'
import TimeTable from '../../Components/TimeTable'
import "../../Style/Pages/TimeTablesPage.css"
import { HorizentalCardsContainer } from '../../Components/Cards'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getSubjectsDetailsList, SubjectsDetailsList } from '../../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule, getTimeTableStructure, saveSchedule } from '../../Script/TimeTableDataFetcher'
import { emptyTimeTableDetails } from '../../Components/TimeTable'
import "../../Script/commonJS"
import Loader from '../../Components/Loader'
import { FullTimeTable, TimeTable as TimeTableType, TimeTableStructure } from '../../data/Types'
import TeacherAndSubjectSelector from './TeacherAndSubjectSelector'
import { ButtonsContainer, SectionsBtnContainer } from './Header'

function TimeTablesPage() {
    return (
        <>
            <div className='page time-table'>
                <MainComponents />
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
            saveSchedule(currentOpenSem + 1, currentOpenSection + 1, newTimeTable, () => setShowPopUp(false)) // api call
        }
    }, [subjectsDetails, periodDetailsIndex, timeTable])

    return (
        <>
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
                    cardList={sems}
                    onCardClick={semCardClickHandler} />

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
            {displayLoader && <Loader />}
        </>
    )
}

export default memo(TimeTablesPage)
