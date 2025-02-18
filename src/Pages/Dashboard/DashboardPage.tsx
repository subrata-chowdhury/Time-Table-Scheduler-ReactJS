import MiniStateContainer from '../../Components/MiniStateContainer'
import "../../Style/Pages/Dashboard.css"
import WorkingHourBarChat from './WorkingHourBarChat'
import React, { JSX, memo, useCallback, useEffect, useRef, useState } from 'react'
import { getTeachersList } from '../../Script/TeachersDataFetcher'
import { getSubjectsDetailsList, SubjectsDetailsList } from '../../Script/SubjectsDataFetcher'
import { TeacherSchedule } from '../../data/Types'
import BasicDetails, { BasicDetailsType } from './BasicDetails'
import TeachersDetailsContainer from './TeacherDetails'
import { getStudents } from '../../Script/StudentDataFetcher'

const DashboardPage: React.FC = (): JSX.Element => {
    return (
        <>
            <div className='page dashboard'>
                <MainComponents />
            </div>
        </>
    )
}

type BasicDetails = {
    subjectsCount: number,
    teachersCount: number,
    practicalSubjects: number,
    theroySubjects: number,
    freeSubjects: number
}

function MainComponents() {
    const [teachersList, setTeahersList] = useState<string[]>([])
    const [perDayValue, setPerDayValue] = useState<number[]>([0, 0, 0, 0, 0])
    const [basicDetails, setBasicDetails] = useState<BasicDetailsType>({
        subjectsCount: 0,
        teachersCount: 0,
        practicalSubjects: 0,
        theroySubjects: 0,
        freeSubjects: 0,
        students: 0
    })
    const subjectsDetails = useRef<SubjectsDetailsList>({})

    const calculatePerDayValue = useCallback((teacherTimeTableDetails: TeacherSchedule, subjectsDetails: SubjectsDetailsList) => {
        let newPerDayValue = []
        for (let index = 0; index < teacherTimeTableDetails.length; index++) {
            let valueForThatDay = 0;
            for (let innerIndex = 0; innerIndex < teacherTimeTableDetails[index].length; innerIndex++) {
                const period = teacherTimeTableDetails[index][innerIndex];
                if (period !== null && period !== undefined) {
                    if (subjectsDetails[period[1]].isPractical === true) {
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

    const startUpFunction = () => {
        getStudents((students) => setBasicDetails(prev => {
            return { ...prev, students: students.length }
        }))
        setPerDayValue([0, 0, 0, 0, 0])
        getTeachersList((data) => { // api call
            setTeahersList(data)
            setBasicDetails(val => {
                return { ...val, teachersCount: data.length }
            })
        });
        getSubjectsDetailsList(data => { // api call
            subjectsDetails.current = data
            setBasicDetails(val => {
                let practicalSubjects = 0;
                let theroySubjects = 0;
                let freeSubjects = 0;
                for (let key in data) {
                    if (data[key].isPractical) practicalSubjects++;
                    else theroySubjects++;
                    if (data[key].isFree) freeSubjects++;
                }
                return { ...val, subjectsCount: Object.keys(data).length, practicalSubjects, theroySubjects, freeSubjects }
            })
        })
    }

    useEffect(() => {
        startUpFunction()
    }, [])

    return (
        <div className='top-sub-container'>
            <div className='left-sub-container'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MiniStateContainer onChange={startUpFunction} />
                </div>
                <BasicDetails basicDetails={basicDetails} />
                <WorkingHourBarChat perDayValue={perDayValue} />
            </div>
            {subjectsDetails.current && <TeachersDetailsContainer
                onCardClick={(timeTable) => {
                    calculatePerDayValue(timeTable, subjectsDetails.current)
                }}
                teachersList={teachersList}
                subjectsDetailsList={subjectsDetails.current} />}
        </div>
    )
}

export default memo(DashboardPage)