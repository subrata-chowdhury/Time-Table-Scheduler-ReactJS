import { memo, useCallback, useEffect, useState } from "react";
import TimeTable from "../../Components/TimeTable";
import { HorizentalCardsContainer } from "../../Components/Cards";
import SemestersAndSubjects from "./SemestersAndSubjects";
import { getTeacher, getTeacherSchedule } from "../../Script/TeachersDataFetcher";
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
        setTeacherTimeTableDetails([]);
    }, [teachersList]);
    const teacherCardClickHandler = useCallback(async (name) => {
        getTeacher(name, async (data) => {
            setTeahersDetails(data);
            if (subjectsDetailsList === null || !subjectsDetailsList) {
                console.log("Subjects Details is not available");
                return;
            }
            let semesters = [];
            for (let index = 0; index < data.subjects.length; index++) {
                await findAndPushSem(data.subjects[index]);
            }
            async function findAndPushSem(subjectName) {
                if (!subjectsDetailsList)
                    return;
                if (semesters.indexOf(subjectsDetailsList[subjectName].sem) === -1)
                    semesters.push(subjectsDetailsList[subjectName].sem);
            }
            setSemesters([...semesters]);
            getTeacherSchedule(name, async (data) => {
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
        }} />
        <TeachersTimeTableContainer teacherTimeTableDetails={teacherTimeTableDetails} subjectsDetails={subjectsDetailsList} />
        <SemestersAndSubjects semList={semesters} subList={teacherDetails.subjects} />
    </div>);
};
const TeachersTimeTableContainer = memo(({ teacherTimeTableDetails, subjectsDetails = null }) => {
    let sir = "Sir";
    return (<div className='time-table-wrapper'>
        <div className='heading'>Time Table for {sir}</div>
        {subjectsDetails && teacherTimeTableDetails.length > 0 &&
            <TimeTable className='teacher-time-table' timeTableWidthInPercent={92} details={teacherTimeTableDetails} breakTimeIndexs={[5]} subjectsDetails={subjectsDetails} />}
        {teacherTimeTableDetails.length <= 0 && <div className='time-table-error-text'>Click a Card</div>}
    </div>);
});
export default TeachersDetailsContainer;
