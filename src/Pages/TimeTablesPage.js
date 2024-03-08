import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'
import "../Style/TimeTablesPage.css"
import { Card, HorizentalCardsContainer } from '../Components/Cards'
import { useEffect, useState } from 'react'
import { getSubjects } from '../Script/SubjectsDataFetcher'
import { getSchedule } from '../Script/TimeTableDataFetcher'

function TimeTablesPage() {
    const [sems, setSems] = useState([])
    const [subjectDetails, setSubjectDetails] = useState()
    const [timeTable, setTimeTable] = useState()
    const [currentOpenSem, setCurrentOpenSem] = useState(0)
    const [currentOpenSection, setCurrentOpenSection] = useState(0)
    useEffect(() => {
        let sem = []
        for (let index = 1; index <= 8; index++) {
            sem.push("Semester " + index);
        }
        setSems(sem);
        getSubjects(setSubjectDetails)
    }, [])
    useEffect(() => {
        getSchedule((data) => {
            try {
                setTimeTable(data[currentOpenSem][currentOpenSection])
            } catch {
                console.log("Error in fetching or selecting Time Table")
            }
        })
    }, [currentOpenSem, currentOpenSection])
    function semCardClickHandler(event) {
        let semester = parseInt(event.target.title.slice(9))
        setCurrentOpenSem(Math.floor((semester + 1) / 2) - 1)
    }
    return (
        <>
            <Menubar activeMenuIndex={3} />
            <div className='main-container time-table'>
                <div className='menubar'>
                    <MiniStateContainer />
                    <div className='main-btn-container'>
                        <ButtonsContainer />
                        <SectionsBtnContainer setCurrentOpenSection={setCurrentOpenSection} />
                    </div>
                </div>
                <HorizentalCardsContainer
                    className='sem-cards-container'
                    cardClassName={"semester-card"}
                    cardData={sems}
                    compressText={false}
                    cardClickHandler={semCardClickHandler} />
                {timeTable && subjectDetails && <TimeTable subjectDetails={subjectDetails} details={timeTable} />}
            </div>
        </>
    )
}

function ButtonsContainer() {
    return (
        <div className='buttons-container'>
            <Card details='Auto Fill Using AI' className='btn' compressText={false} ></Card>
            <Card details='Fill Manually' className='btn' compressText={false} ></Card>
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

// function Loader() {
//     return (
//         <div className='loader'>
//             <div className='outer-circle'></div>
//             <div className='inner-circle'></div>
//         </div>
//     )
// }

export default TimeTablesPage