import { memo, useEffect, useRef, useState } from "react";
import { getTeachersList } from "../../Script/TeachersDataFetcher";
import Cards from "../../Components/Cards";
import { getSubjectsList } from "../../Script/SubjectsDataFetcher";

const TeacherAndSubjectSelector = memo(({ active = false, onCancelBtnClick = () => { }, onSetBtnClick = () => { } }) => {
    const teacherList = useRef([]);
    const subjectList = useRef([]);

    function onTeacherActive(list) {
        if (list)
            teacherList.current = list;
    }

    function onSubjectActive(list) {
        if (list)
            subjectList.current = list;
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
                    <button onClick={() => onCancelBtnClick()}>Cancel</button>
                </div>
            </div>
            <div className={'teacher-subject-selector-container-bg' + (active ? " active" : " ")}></div>
        </>
    );
});

const TeacherCardsContainer = memo(({ onActive = () => { } }) => {
    const [teacherList, setTeacherList] = useState();

    useEffect(() => {
        getTeachersList(setTeacherList); // api call
    }, []);

    return (
        <div className='teacher-cards-container'>
            <Cards cardClassName={"select-teacher-card"} cardList={teacherList} onAddBtnClick={() => {
                window.location.href = window.location.origin + "/Teachers";
            }} canStayActiveMultipleCards={true} onActive={onActive} />
        </div>
    );
});

const SubjectCardsContainer = memo(({ onActive = () => { } }) => {
    const [subjectsList, setSubjectsList] = useState();

    useEffect(() => {
        getSubjectsList(setSubjectsList); // api call
    }, []);

    return (
        <div className='subject-cards-container'>
            <Cards cardClassName={"select-subject-card"} cardList={subjectsList} onAddBtnClick={() => {
                window.location.href = window.location.origin + "/Subjects";
            }} onActive={onActive} />
        </div>
    );
});

export default memo(TeacherAndSubjectSelector);
