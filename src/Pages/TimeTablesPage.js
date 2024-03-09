import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'
import "../Style/TimeTablesPage.css"
import { Card, HorizentalCardsContainer } from '../Components/Cards'
import { useCallback, useEffect, useState } from 'react'
import { getSubjects } from '../Script/SubjectsDataFetcher'
import { generateTimeTable, getSchedule } from '../Script/TimeTableDataFetcher'

function TimeTablesPage() {
    const [sems, setSems] = useState([])
    const [subjectsDetails, setSubjectsDetails] = useState()
    const [allTimeTables, setAllTimeTables] = useState()
    const [timeTable, setTimeTable] = useState()
    const [currentOpenSem, setCurrentOpenSem] = useState(0)
    const [currentOpenSection, setCurrentOpenSection] = useState(0)
    const [displayLoader, setDisplayLoader] = useState(false)

    useEffect(() => {
        let sem = []
        for (let index = 1; index <= 8; index++) {
            sem.push("Semester " + index);
        }
        setSems(sem);
        getSubjects(setSubjectsDetails)
    }, [])
    let startUpFunction = useCallback(() => {
        try {
            getSchedule((data) => {
                setTimeTable(data[currentOpenSem][currentOpenSection])
                console.log("call")
            })
        } catch {
            alert("Error in selecting time table")
        }
    }, [currentOpenSem, currentOpenSection])
    useEffect(() => {
        startUpFunction()
    }, [currentOpenSem, currentOpenSection, allTimeTables, startUpFunction])

    function semCardClickHandler(event) {
        let semester = parseInt(event.target.title.slice(9))
        setCurrentOpenSem(Math.floor((semester + 1) / 2) - 1)
    }
    return (
        <>
            <Loader display={displayLoader} />
            <Menubar activeMenuIndex={3} />
            <div className='main-container time-table'>
                <div className='menubar'>
                    <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                    <div className='main-btn-container'>
                        <ButtonsContainer setAllTimeTables={setAllTimeTables} setDisplayLoader={setDisplayLoader} />
                        <SectionsBtnContainer setCurrentOpenSection={setCurrentOpenSection} />
                    </div>
                </div>
                <HorizentalCardsContainer
                    className='sem-cards-container'
                    cardClassName={"semester-card"}
                    cardData={sems}
                    compressText={false}
                    cardClickHandler={semCardClickHandler} />
                {subjectsDetails && <TimeTable subjectsDetails={subjectsDetails} details={timeTable} />}
                {!timeTable &&
                    (<div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
                        No Time Table Found for Year {currentOpenSem + 1} Sec {String.fromCharCode(65 + currentOpenSection)}
                    </div>)}
            </div>
        </>
    )
}

function ButtonsContainer({ setAllTimeTables, setDisplayLoader }) {
    function autoFillBtnClickHandler() {
        setDisplayLoader(true)
        generateTimeTable((data) => {
            setAllTimeTables(data)
            setDisplayLoader(false)
        })
    }
    function fillManuallyBtnClickHandler() {

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