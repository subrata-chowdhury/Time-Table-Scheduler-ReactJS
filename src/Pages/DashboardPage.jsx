import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Dashboard.css"
import WorkingHourBarChat from '../Components/WorkingHourBarChat'
import { HorizentalCardsContainer } from '../Components/Cards'
import TimeTable from '../Components/TimeTable'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getTeacher, getTeacherList, getTeacherSchedule } from '../Script/TeachersDataFetcher'
import { getSubjects } from '../Script/SubjectsDataFetcher'
import "../Script/commonJS"
import OwnerFooter from '../Components/OwnerFooter'

function DashboardPage() {
    return (
        <>
            <Menubar activeMenuIndex={2} />
            <div className='main-container dashboard'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>
    )
}

function MainComponents() {
    const [perDayValue, setPerDayValue] = useState([0, 0, 0, 0, 0])
    const [fileChange, setFileChange] = useState(false)

    const startUpFunction = useCallback(() => {
        setFileChange(val => !val)
        setPerDayValue([0, 0, 0, 0, 0])
    }, [setFileChange, setPerDayValue])

    return (
        <div className='top-sub-container'>
            <div className='left-sub-container'>
                <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                <div className='empty-container'>Under Development</div>
                <WorkingHourBarChat perDayValue={perDayValue} />
            </div>
            <div className='right-sub-container'>
                <TeacherDetailsContainer setPerDayValue={setPerDayValue} fileChange={fileChange} />
            </div>
        </div>
    )
}

function TeacherDetailsContainer({ setPerDayValue, fileChange }) {
    const [teachersList, setTeahersList] = useState([])
    useEffect(() => {
        getTeacherList(setTeahersList);
        getSubjects(data => {
            subjectsDetails.current = data;
        });
        teacherTimeTableDetails.current = []
        teacherDetails.current = {
            freeTime: [],
            subjects: [],
        }
        semestersRef.current = []
    }, [fileChange])

    const teacherTimeTableDetails = useRef()
    const subjectsDetails = useRef()
    const semestersRef = useRef([])
    const teacherDetails = useRef({
        freeTime: [],
        subjects: [],
    })
    const teacherCardClickHandler = useCallback((event) => {
        getTeacher(event.target.title, updateValues)
        function updateValues(data) {
            teacherDetails.current = data
            let semesters = [];
            for (let index = 0; index < data.subjects.length; index++) {
                findAndPushSem(subjectsDetails.current[data.subjects[index]])
            }
            function findAndPushSem(subjectData) {
                if (semesters.indexOf(subjectData.sem) === -1) semesters.push(subjectData.sem)
                semestersRef.current = semesters
            }
            getTeacherSchedule(event.target.title, data => {
                for (let index = 0; index < data.length; index++) {
                    for (let innerIndex = 0; innerIndex < data[index].length; innerIndex++) {
                        if (!data[index][innerIndex]) continue
                        data[index][innerIndex] = [
                            `Sem ${data[index][innerIndex][0]} - ${String.fromCharCode(65 + parseInt(data[index][innerIndex][1]))}`,
                            data[index][innerIndex][2],
                            data[index][innerIndex][3]
                        ]
                    }
                }
                teacherTimeTableDetails.current = data
                calculatePerDayValue(data, subjectsDetails.current)
            })
        }
    }, [])
    const calculatePerDayValue = useCallback((teacherTimeTableDetails, subjectsDetails) => {
        if (teacherTimeTableDetails === null || !teacherTimeTableDetails) return
        let newPerDayValue = []
        for (let index = 0; index < teacherTimeTableDetails.length; index++) {
            let valueForThatDay = 0;
            for (let innerIndex = 0; innerIndex < teacherTimeTableDetails[index].length; innerIndex++) {
                if (teacherTimeTableDetails[index][innerIndex] || teacherTimeTableDetails[index][innerIndex] !== null) {
                    if (subjectsDetails[teacherTimeTableDetails[index][innerIndex][1]].isPractical === true) {
                        valueForThatDay += 3;
                        innerIndex += 3
                    }
                    else valueForThatDay++;
                }
            }
            newPerDayValue.push(valueForThatDay)
        }
        setPerDayValue(newPerDayValue);
    }, [])
    return (
        <div className='teachers-details-container'>
            <HorizentalCardsContainer
                cardClassName={"teacher-card"}
                cardData={teachersList}
                cardClickHandler={teacherCardClickHandler}
                showEditBtn={true}
                editBtnClickHandler={(details) => {
                    window.location.href = window.location.origin + "/Teachers?click=" + details
                }} />
            <TeachersTimeTableContainer
                teacherTimeTableDetails={teacherTimeTableDetails.current}
                subjectsDetails={subjectsDetails.current} />
            <div className='sem-and-subject-container'>
                <SemesterContainer semList={semestersRef.current} />
                <SubjectContainer subList={teacherDetails.current.subjects} />
            </div>
        </div>
    )
}

const TeachersTimeTableContainer = memo(({ teacherTimeTableDetails, subjectsDetails = null }) => {
    let sir = "Sir";
    return (
        <div className='time-table-wrapper'>
            <div className='heading'>Time Table for {sir}</div>
            {subjectsDetails && teacherTimeTableDetails &&
                <TimeTable
                    className='teacher-time-table'
                    timeTableWidthInPercent={92}
                    details={teacherTimeTableDetails}
                    subjectsDetails={subjectsDetails} />}
        </div>
    )
})

const SemesterContainer = memo(({ semList = [] }) => {
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
})

const SubjectContainer = memo(({ subList = [] }) => {
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
})
export default memo(DashboardPage)