import MiniStateContainer from '../Components/MiniStateContainer';
import Menubar from '../Components/Menubar';
import "../Style/Dashboard.css";
import WorkingHourBarChat from '../Components/WorkingHourBarChat';
import { HorizentalCardsContainer } from '../Components/Cards';
import TimeTable from '../Components/TimeTable';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getTeacher, getTeachersList, getTeacherSchedule } from '../Script/TeachersDataFetcher';
import { getSubjectsDetailsList } from '../Script/SubjectsDataFetcher';
import "../Script/commonJS";
import OwnerFooter from '../Components/OwnerFooter';
const DashboardPage = () => {
    return (<>
            <Menubar activeMenuIndex={2}/>
            <div className='main-container dashboard'>
                <MainComponents />
                <OwnerFooter />
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
                <MiniStateContainer onChange={startUpFunction}/>
                <BasicDetails basicDetails={basicDetails}/>
                <WorkingHourBarChat perDayValue={perDayValue}/>
            </div>
            <div className='right-sub-container'>
                <TeachersDetailsContainer onCardClick={(timeTable) => {
            calculatePerDayValue(timeTable, subjectsDetails.current);
        }} teachersList={teachersList} subjectsDetailsList={subjectsDetails.current}/>
            </div>
        </div>);
}
const BasicDetails = memo(({ basicDetails }) => {
    return (<div className='basic-details'>
            <div className='basic-details-container'>
                <div className='container'>
                    <Container label="Subjects" value={basicDetails.subjectsCount}/>
                    <Container label="Teachers" value={basicDetails.teachersCount}/>
                </div>
                <div className='container'>
                    <Container label="Practical Subjects" value={basicDetails.practicalSubjects}/>
                    <Container label="Theory Subjects" value={basicDetails.theroySubjects}/>
                </div>
            </div>
            <div className='basic-details-container' style={{ gridTemplateColumns: "auto" }}>
                <div className='container'>
                    <Container label="Subjects (Not Taken by Teacher)" value={basicDetails.freeSubjects}/>
                    <Container label="Subjects (Taken by Teacher)" value={basicDetails.subjectsCount - basicDetails.freeSubjects}/>
                </div>
            </div>
        </div>);
});
const Container = memo(({ label = "Demo", value = 0 }) => {
    return (<div className='sub-container'>
            <div className='title'>{label}</div>
            <div className='value'>{value}</div>
        </div>);
});
const TeachersDetailsContainer = ({ onCardClick = () => { }, teachersList = [], subjectsDetailsList }) => {
    const [teacherTimeTableDetails, setTeacherTimeTableDetails] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [teacherDetails, setTeahersDetails] = useState({
        freeTime: [],
        subjects: [],
    });
    const [teachersNameList, setTeahersNameList] = useState([]);
    useEffect(() => {
        setTeahersNameList(teachersList);
        setSemesters([]);
        setTeahersDetails(val => { return { ...val, subjects: [] }; });
    }, [teachersList]);
    const teacherCardClickHandler = useCallback((name) => {
        getTeacher(name, (data) => {
            setTeahersDetails(data);
            if (subjectsDetailsList === null || !subjectsDetailsList) {
                console.log("Subjects Details is not available");
                return;
            }
            let semesters = [];
            for (let index = 0; index < data.subjects.length; index++) {
                findAndPushSem(data.subjects[index]);
            }
            function findAndPushSem(subjectName) {
                if (!subjectsDetailsList)
                    return;
                if (semesters.indexOf(subjectsDetailsList[subjectName].sem) === -1)
                    semesters.push(subjectsDetailsList[subjectName].sem);
            }
            setSemesters([...semesters]);
            getTeacherSchedule(name, data => {
                for (let index = 0; index < data.length; index++) {
                    for (let innerIndex = 0; innerIndex < data[index].length; innerIndex++) {
                        if (!data[index][innerIndex])
                            continue;
                        const innerData = data[index][innerIndex];
                        if (innerData) {
                            data[index][innerIndex] = [
                                `Sem ${innerData[0]} - ${String.fromCharCode(65 + parseInt(innerData[1]))}`,
                                innerData[2],
                                innerData[3]
                            ];
                        }
                    }
                }
                setTeacherTimeTableDetails(data);
                if (subjectsDetailsList === null || !subjectsDetailsList)
                    return;
                onCardClick(data);
            });
        });
    }, [subjectsDetailsList]);
    return (<div className='teachers-details-container'>
            <HorizentalCardsContainer cardList={teachersNameList} onCardClick={(name) => {
            teacherCardClickHandler(name);
        }} showEditBtn={true} onEditBtnClick={(details) => {
            window.location.href = window.location.origin + "/Teachers?click=" + details;
        }}/>
            <TeachersTimeTableContainer teacherTimeTableDetails={teacherTimeTableDetails} subjectsDetails={subjectsDetailsList}/>
            <div className='sem-and-subject-container'>
                <SemesterContainer semList={semesters}/>
                <SubjectContainer subList={teacherDetails.subjects}/>
            </div>
        </div>);
};
const TeachersTimeTableContainer = memo(({ teacherTimeTableDetails, subjectsDetails = null }) => {
    let sir = "Sir";
    return (<div className='time-table-wrapper'>
            <div className='heading'>Time Table for {sir}</div>
            {subjectsDetails && teacherTimeTableDetails.length > 0 &&
            <TimeTable className='teacher-time-table' timeTableWidthInPercent={92} details={teacherTimeTableDetails} subjectsDetails={subjectsDetails}/>}
            {teacherTimeTableDetails.length <= 0 && <div className='time-table-error-text'>Click a Card</div>}
        </div>);
});
const SemesterContainer = memo(({ semList = [] }) => {
    return (<div className='sem-container'>
            <div className='heading'>Semesters</div>
            <div className='sub-sem-container'>
                {semList && semList.length > 0 && semList.map((sem) => {
            return (<div className='sem' key={sem}>
                            {sem}
                        </div>);
        })}
            </div>
        </div>);
});
const SubjectContainer = memo(({ subList = [] }) => {
    return (<div className='subject-container'>
            <div className='heading'>Subjects</div>
            <div className='sub-subject-container'>
                {subList && subList.length > 0 && subList.map((subject) => {
            return (<div className='subject' key={subject}>
                            {subject.toUpperCase()}
                        </div>);
        })}
            </div>
        </div>);
});
export default memo(DashboardPage);
