import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Dashboard.css"
import WorkingHourBarChat from '../Components/WorkingHourBarChat'
import { HorizentalCardsContainer } from '../Components/Cards'
import TimeTable from '../Components/TimeTable'
import { useEffect, useState } from 'react'
import { getTeacher, getTeacherList, getTeacherSchedule } from '../Script/TeachersDataFetcher'
import { getSubjects } from '../Script/SubjectsDataFetcher'
import "../Script/commonJS"

function DashboardPage() {
    const [perDayValue, setPerDayValue] = useState([0, 0, 0, 0, 0])
    const [fileChange, setFileChange] = useState(false)

    return (
        <>
            <Menubar activeMenuIndex={2} />
            <div className='main-container dashboard'>
                <div className='left-sub-container'>
                    <MiniStateContainer callBackAfterStateUpdate={() => { setFileChange(true) }} />
                    <div className='empty-container'>Under Development</div>
                    <WorkingHourBarChat perDayValue={perDayValue} />
                </div>
                <div className='right-sub-container'>
                    <TeacherDetailsContainer setPerDayValue={setPerDayValue} fileChange={fileChange} setFileChange={setFileChange} />
                </div>
            </div>
        </>
    )
}

function TeacherDetailsContainer({ setPerDayValue, fileChange, setFileChange }) {
    const [teachersList, setTeahersList] = useState([])
    const [semesters, setSemesters] = useState([])
    const [teacherTimeTableDetails, setTeacherTimeTableDetails] = useState()
    const [subjectsDetails, setSubjectsDetails] = useState()
    useEffect(() => {
        getTeacherList(setTeahersList);
        getSubjects(data => {
            setSubjectsDetails(data);
        });
        setTeacherTimeTableDetails()
        setTeacherDetails({
            freeTime: [],
            subjects: [],
        })
        setSemesters()
        setFileChange(false)
    }, [fileChange, setFileChange])

    const [teacherDetails, setTeacherDetails] = useState({
        freeTime: [],
        subjects: [],
    })
    function teacherCardClickHandler(event) {
        getTeacher(event.target.title, updateValues)
        function updateValues(data) {
            setTeacherDetails(data)
            let semesters = [];
            for (let index = 0; index < data.subjects.length; index++) {
                findAndPushSem(subjectsDetails[data.subjects[index]])
            }
            function findAndPushSem(subjectData) {
                if (semesters.indexOf(subjectData.sem) === -1) semesters.push(subjectData.sem)
                setSemesters(semesters)
            }
            getTeacherSchedule(event.target.title, data => {
                setTeacherTimeTableDetails(data)
                calculatePerDayValue(data, subjectsDetails)
            })
        }
    }
    let calculatePerDayValue = (teacherTimeTableDetails, subjectsDetails) => {
        if (teacherTimeTableDetails === null || !teacherTimeTableDetails) return
        let newPerDayValue = []
        for (let index = 0; index < teacherTimeTableDetails.length; index++) {
            let valueForThatDay = 0;
            for (let innerIndex = 0; innerIndex < teacherTimeTableDetails[index].length; innerIndex++) {
                if (teacherTimeTableDetails[index][innerIndex] || teacherTimeTableDetails[index][innerIndex] !== null) {
                    if (subjectsDetails[teacherTimeTableDetails[index][innerIndex][2]].isPractical === true) {
                        valueForThatDay += 3;
                        innerIndex += 3
                    }
                    else valueForThatDay++;
                }
            }
            newPerDayValue.push(valueForThatDay)
        }
        setPerDayValue(newPerDayValue);
    }
    return (
        <div className='teachers-details-container'>
            <HorizentalCardsContainer
                cardClassName={"teacher-card"}
                cardData={teachersList}
                cardClickHandler={teacherCardClickHandler} />
            <TeachersTimeTableContainer
                teacherTimeTableDetails={teacherTimeTableDetails}
                subjectsDetails={subjectsDetails} />
            <div className='sem-and-subject-container'>
                <SemesterContainer semList={semesters} />
                <SubjectContainer subList={teacherDetails.subjects} />
            </div>
        </div>
    )
}

function TeachersTimeTableContainer({ teacherTimeTableDetails, subjectsDetails = null }) {
    let sir = "Sir";
    return (
        <div className='time-table-wrapper'>
            <div className='heading'>Time Table for {sir}</div>
            {subjectsDetails && teacherTimeTableDetails &&
                <TimeTable
                    subjectIndexAtPeriod={2}
                    className='teacher-time-table'
                    timeTableWidthInPercent={92}
                    details={teacherTimeTableDetails}
                    subjectsDetails={subjectsDetails} />}
        </div>
    )
}

function SemesterContainer({ semList = [] }) {
    let sems = [];
    for (let index = 0; index < semList.length; index++) {
        sems.push(<div className='sem' key={semList[index]}>{semList[index]}</div>)
    }
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
    for (let index = 0; index < subList.length; index++) {
        subs.push(
            <div className='subject' key={subList[index]}>
                {subList[index].toUpperCase()}
            </div>
        )
    }
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