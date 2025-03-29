import { memo, useEffect, useRef, useState } from "react"
import { getTeachersList } from "../../Script/TeachersDataFetcher"
import Cards from "../../Components/Cards"
import { getSubjectsList } from "../../Script/SubjectsDataFetcher"

interface TeacherAndSubjectSelectorProps {
    active: boolean
    onCancelBtnClick?: () => void
    onSetBtnClick?: (teacherList: string[], subjectList: string[]) => void
}

const TeacherAndSubjectSelector: React.FC<TeacherAndSubjectSelectorProps> = memo(({
    active = false,
    onCancelBtnClick = () => { },
    onSetBtnClick = () => { }
}) => {
    const teacherList = useRef<string[]>([])
    const subjectList = useRef<string[]>([])

    function onTeacherActive(list: string[] | undefined) {
        if (list)
            teacherList.current = list
    }
    function onSubjectActive(list: string[] | undefined) {
        if (list)
            subjectList.current = list
    }
    return (
        <>
            <div className={'teacher-subject-selector-container' + (active ? " active" : " ")}>
                <div className='teacher-subject-card-container'>
                    <TeacherCardsContainer onActive={onTeacherActive} />
                    <SubjectCardsContainer onActive={onSubjectActive} />
                </div>
                <div className='teacher-subject-selector-btns-container'>
                    <button onClick={() => onSetBtnClick(teacherList.current, subjectList.current)}>SET</button>
                    <button style={{ color: "dodgerblue", background: 'rgba(255,255,255,0)' }} onClick={() => onCancelBtnClick()}>Cancel</button>
                </div>
            </div >
            <div className={'teacher-subject-selector-container-bg' + (active ? " active" : " ")}></div>
        </>
    )
})

interface TeacherCardsContainerProps {
    onActive: (activeCards: string[] | undefined) => void
}

const TeacherCardsContainer: React.FC<TeacherCardsContainerProps> = memo(({ onActive = () => { } }) => {
    const [teacherList, setTeacherList] = useState<string[]>()
    useEffect(() => {
        getTeachersList(setTeacherList) // api call
    }, [])
    return (
        <div className='teacher-cards-container'>
            <Cards
                cardClassName={"select-teacher-card"}
                cardList={teacherList}
                onAddBtnClick={() => {
                    window.location.href = window.location.origin + "/Teachers";
                }}
                canStayActiveMultipleCards={true}
                onActive={onActive} />
        </div>
    )
})

interface SubjectsCardsContainerProps {
    onActive: (activeCards: string[] | undefined) => void
}

const SubjectCardsContainer: React.FC<SubjectsCardsContainerProps> = memo(({ onActive = () => { } }) => {
    const [subjectsList, setSubjectsList] = useState<string[]>()
    useEffect(() => {
        getSubjectsList(setSubjectsList) // api call
    }, [])
    return (
        <div className='subject-cards-container'>
            <Cards
                cardClassName={"select-subject-card"}
                cardList={subjectsList}
                onAddBtnClick={() => {
                    window.location.href = window.location.origin + "/Subjects";
                }}
                onActive={onActive} />
        </div>
    )
})

export default memo(TeacherAndSubjectSelector)