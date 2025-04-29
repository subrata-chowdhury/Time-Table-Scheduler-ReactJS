import { memo, useCallback, useEffect, useState } from "react"
import TimeTable from "../../Components/TimeTable"
import { Teacher, TeacherSchedule } from "../../data/Types"
import { SubjectsDetailsList } from "../../Script/SubjectsDataFetcher"
import { HorizentalCardsContainer } from "../../Components/Cards"
import SemestersAndSubjects from "./SemestersAndSubjects"
import { getTeacher, getTeacherSchedule } from "../../Script/TeachersDataFetcher"


interface TeachersDetailsContainerProps {
    onCardClick: (timeTable: TeacherSchedule) => void,
    teachersList: string[],
    subjectsDetailsList: SubjectsDetailsList,
    dayNames: string[]
}

const TeachersDetailsContainer: React.FC<TeachersDetailsContainerProps> = ({
    onCardClick = () => { },
    teachersList = [],
    subjectsDetailsList,
    dayNames
}) => {
    const [teacherTimeTableDetails, setTeacherTimeTableDetails] = useState<TeacherSchedule>([])
    const [semesters, setSemesters] = useState<number[]>([])
    const [teacherDetails, setTeahersDetails] = useState<Teacher>({
        freeTime: [],
        subjects: [],
    })
    const [teachersNameList, setTeahersNameList] = useState<string[]>([])

    useEffect(() => {
        setTeahersNameList(teachersList)
        setSemesters([])
        setTeahersDetails(val => { return { ...val, subjects: [] } })
        setTeacherTimeTableDetails([])
    }, [teachersList])


    const teacherCardClickHandler = useCallback(async (name: string) => {
        getTeacher(name, async (data: Teacher) => {
            setTeahersDetails(data)

            if (subjectsDetailsList === null || !subjectsDetailsList) {
                console.log("Subjects Details is not available")
                return
            }

            let semesters: number[] = [];
            for (let index = 0; index < data.subjects.length; index++) {
                await findAndPushSem(data.subjects[index])
            }
            async function findAndPushSem(subjectName: string) {
                if (!subjectsDetailsList || Object.keys(subjectsDetailsList).length === 0) return
                if (semesters.indexOf(subjectsDetailsList[subjectName].sem) === -1) semesters.push(subjectsDetailsList[subjectName].sem)
            }
            setSemesters([...semesters])

            getTeacherSchedule(name, async data => { // api call
                for (let index = 0; index < data.length; index++) {
                    for (let innerIndex = 0; innerIndex < data[index].length; innerIndex++) {
                        if (!data[index][innerIndex]) continue
                        const innerData = data[index][innerIndex];
                        if (innerData) {
                            data[index][innerIndex] = [
                                `Sem ${innerData[0]} - ${String.fromCharCode(65 + parseInt(innerData[1]))}`,
                                innerData[2],
                                innerData[3] as string
                            ]
                        }
                    }
                }
                setTeacherTimeTableDetails(data)
                if (subjectsDetailsList === null || !subjectsDetailsList) return
                onCardClick(data)
            })
        })
    }, [subjectsDetailsList])

    return (
        <div className='teachers-details-container'>
            <HorizentalCardsContainer
                cardList={teachersNameList}
                onCardClick={(name) => {
                    teacherCardClickHandler(name)
                }}
                showEditBtn={true}
                onEditBtnClick={(details) => {
                    window.location.href = window.location.origin + "/Teachers?click=" + details
                }} />
            <TeachersTimeTableContainer
                dayNames={dayNames}
                teacherTimeTableDetails={teacherTimeTableDetails}
                subjectsDetails={subjectsDetailsList} />
            <SemestersAndSubjects semList={semesters} subList={teacherDetails.subjects} />
        </div>
    )
}

interface TeachersTimeTableContainerProps {
    teacherTimeTableDetails: TeacherSchedule,
    subjectsDetails: SubjectsDetailsList,
    dayNames: string[]
}

const TeachersTimeTableContainer: React.FC<TeachersTimeTableContainerProps> = memo(({ teacherTimeTableDetails, subjectsDetails = null, dayNames }) => {
    let sir = "Sir";
    return (
        <div className='time-table-wrapper'>
            <div className='heading' style={{ color: 'var(--textColor)' }}>Time Table for {sir}</div>
            {subjectsDetails && teacherTimeTableDetails.length > 0 &&
                <TimeTable
                    className='teacher-time-table'
                    timeTableWidthInPercent={92}
                    details={teacherTimeTableDetails}
                    breakTimeIndexs={[5]}
                    subjectsDetails={subjectsDetails}
                    dayNames={dayNames} />}
            {teacherTimeTableDetails.length <= 0 && <div className='time-table-error-text'>Click a Card</div>}
        </div>
    )
})

export default TeachersDetailsContainer