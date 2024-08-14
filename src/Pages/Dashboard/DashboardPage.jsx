import MiniStateContainer from '../../Components/MiniStateContainer';
import "../../Style/Pages/Dashboard.css";
import WorkingHourBarChat from '../../Components/WorkingHourBarChat';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getTeachersList } from '../../Script/TeachersDataFetcher';
import { getSubjectsDetailsList } from '../../Script/SubjectsDataFetcher';
import "../../Script/commonJS";
import BasicDetails from './BasicDetails';
import TeachersDetailsContainer from './TeacherDetails';
const DashboardPage = () => {
    return (<>
        <div className='page dashboard'>
            <MainComponents />
        </div>
    </>);
};
function MainComponents() {
    const [teachersList, setTeahersList] = useState([]);
    const [perDayValue, setPerDayValue] = useState([0, 0, 0, 0, 0]);
    const [basicDetails, setBasicDetails] = useState({
        subjectsCount: 0,
        teachersCount: 0,
        practicalSubjects: 0,
        theroySubjects: 0,
        freeSubjects: 0
    });
    const subjectsDetails = useRef({});
    const calculatePerDayValue = useCallback((teacherTimeTableDetails, subjectsDetails) => {
        let newPerDayValue = [];
        for (let index = 0; index < teacherTimeTableDetails.length; index++) {
            let valueForThatDay = 0;
            for (let innerIndex = 0; innerIndex < teacherTimeTableDetails[index].length; innerIndex++) {
                const period = teacherTimeTableDetails[index][innerIndex];
                if (period !== null && period !== undefined) {
                    if (subjectsDetails[period[1]].isPractical === true) {
                        valueForThatDay += 3;
                        innerIndex += 3;
                    }
                    else
                        valueForThatDay++;
                }
            }
            newPerDayValue.push(valueForThatDay);
        }
        setPerDayValue(newPerDayValue);
    }, []);
    const startUpFunction = () => {
        setPerDayValue([0, 0, 0, 0, 0]);
        getTeachersList((data) => {
            setTeahersList(data);
            setBasicDetails(val => {
                return { ...val, teachersCount: data.length };
            });
        });
        getSubjectsDetailsList(data => {
            subjectsDetails.current = data;
            setBasicDetails(val => {
                let practicalSubjects = 0;
                let theroySubjects = 0;
                let freeSubjects = 0;
                for (let key in data) {
                    if (data[key].isPractical)
                        practicalSubjects++;
                    else
                        theroySubjects++;
                    if (data[key].isFree)
                        freeSubjects++;
                }
                return { ...val, subjectsCount: Object.keys(data).length, practicalSubjects, theroySubjects, freeSubjects };
            });
        });
    };
    useEffect(() => {
        startUpFunction();
    }, []);
    return (<div className='top-sub-container'>
        <div className='left-sub-container'>
            <MiniStateContainer onChange={startUpFunction} />
            <BasicDetails basicDetails={basicDetails} />
            <WorkingHourBarChat perDayValue={perDayValue} />
        </div>
        <div className='right-sub-container'>
            <TeachersDetailsContainer onCardClick={(timeTable) => {
                calculatePerDayValue(timeTable, subjectsDetails.current);
            }} teachersList={teachersList} subjectsDetailsList={subjectsDetails.current} />
        </div>
    </div>);
}
export default memo(DashboardPage);
