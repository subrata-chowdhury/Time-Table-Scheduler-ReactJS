import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'
import "../Style/TimeTablesPage.css"
import { Card, HorizentalCardsContainer } from '../Components/Cards'
import { useEffect, useState } from 'react'
import { getSubjects } from '../Script/SubjectsDataFetcher'

function TimeTablesPage() {
    const [sems, setSems] = useState([])
    const [subjectDetails, setSubjectDetails] = useState([])
    useEffect(() => {
        let sem = []
        for (let index = 1; index <= 8; index++) {
            sem.push("Semester " + index);
        }
        setSems(sem);
        getSubjects(setSubjectDetails)
    }, [])
    return (
        <>
            <Menubar activeMenuIndex={3} />
            <div className='main-container time-table'>
                <div className='menubar'>
                    <MiniStateContainer />
                    <div className='main-btn-container'>
                        <ButtonsContainer />
                        <SectionsBtnContainer />
                    </div>
                </div>
                <HorizentalCardsContainer className='sem-cards-container' cardClassName={"semester-card"} cardData={sems} />
                <TimeTable subjectDetails={subjectDetails} />
            </div>
        </>
    )
}

function ButtonsContainer() {
    return (
        <div className='buttons-container'>
            <Card details='Auto Fill Using AI' className='btn' ></Card>
            <Card details='Fill Manually' className='btn' ></Card>
        </div>
    )
}

function SectionsBtnContainer({ noOfSections = 3 }) {
    let sectionBtns = [];
    for (let index = 0; index < noOfSections; index++) {
        let char = String.fromCharCode(65 + index);
        sectionBtns.push(<Card details={char} key={index} className='section-btn' />)
    }
    return (
        <div className='section-btn-container'>
            {sectionBtns}
        </div>
    )
}

export default TimeTablesPage