import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Dashboard.css"
import WorkingHourBarChat from '../Components/WorkingHourBarChat'
import { HorizentalCardsContainer } from '../Components/Cards'
import TimeTable from '../Components/TimeTable'
import { useEffect, useState } from 'react'
import { getTeacherList } from '../Script/TeachersDataFetcher'

function DashboardPage() {
    return (
        <>
            <Menubar activeMenuIndex={2} />
            <div className='main-container dashboard'>
                <div className='left-sub-container'>
                    <MiniStateContainer />
                    <div className='empty-container'>Under Development</div>
                    <WorkingHourBarChat />
                </div>
                <div className='right-sub-container'>
                    <TeacherDetailsContainer />
                </div>
            </div>
        </>
    )
}

function TeacherDetailsContainer() {
    const [teachersList, setTeahersList] = useState([])
    useEffect(()=>{
        getTeacherList(setTeahersList);
    },[])
    return (
        <div className='teachers-details-container'>
            <HorizentalCardsContainer cardClassName={"teacher-card"} cardData={teachersList} />
            <TeachersTimeTableContainer />
            <div className='sem-and-subject-container'>
                <SemesterContainer />
                <SubjectContainer />
            </div>
        </div>
    )
}

function TeachersTimeTableContainer() {
    let sir = "Sir";
    return (
        <div className='time-table-wrapper'>
            <div className='heading'>Time Table for {sir}</div>
            <TimeTable className='teacher-time-table' timeTableWidthInPercent={92} />
        </div>
    )
}

function SemesterContainer({ semList = [1, 2, 5, 6] }) {
    let sems = [];
    semList.forEach((e) => {
        sems.push(<div className='sem' key={e}>{e}</div>)
    })
    return (
        <div className='sem-container'>
            <div className='heading'>Semesters</div>
            <div className='sub-sem-container'>
                {sems}
            </div>
        </div>
    )
}

function SubjectContainer({ subList = ["a", "b", "c"] }) {
    let subs = [];
    subList.forEach((e) => {
        subs.push(<div className='subject' key={e}>{e.toUpperCase()}</div>)
    })
    return (
        <div className='subject-container'>
            <div className='heading'>Subjects</div>
            <div className='sub-subject-container'>
                {subs}
            </div>
        </div>
    )
}

export default DashboardPage