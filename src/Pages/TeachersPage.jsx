import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import Cards from '../Components/Cards'
import "../Style/Teachers.css"
import { useEffect, useRef, useState } from 'react'
import SearchBar, { match } from '../Components/SearchBar'
import { deleteTeacher, getTeacher, getTeacherList, saveTeacher } from '../Script/TeachersDataFetcher'
import { getTimeTableStructure } from '../Script/TimeTableDataFetcher'
import { getSubjectList } from '../Script/SubjectsDataFetcher'
import "../Script/commonJS"
import { hasElement } from '../Script/util'
import { TagInput } from '../Components/TagInput'
import OwnerFooter from '../Components/OwnerFooter'

function TeachersPage() {
    const [teachersList, setTeahersList] = useState([]);
    const [teacherDetails, setTeacherDetails] = useState({
        freeTime: [],
        subjects: [],
    })
    const [teacherName, setTeacherName] = useState();
    const [periodCount, setPeriodCount] = useState();

    const teacherDeleteBtn = useRef()
    const cardsContainer = useRef()

    useEffect(() => {
        startUpFunction()
    }, [])
    function startUpFunction() {
        getTeacherList(setTeahersList);
        setTeacherDetails({
            freeTime: [],
            subjects: [],
        });
        setTeacherName("");
        getTimeTableStructure((timeTableStructure) => { setPeriodCount(timeTableStructure.periodCount) });
    }
    function teacherCardOnClickHandler(event) {
        getTeacher(event.target.title, setTeacherDetailsControler);
        function setTeacherDetailsControler(data) {
            setTeacherDetails(data)
        }
        setTeacherName(event.target.title);
        teacherDeleteBtn.current.style.cssText = "display: block";
    }
    function addTeacherCardClickHandler() {
        setTeacherDetails({
            freeTime: [],
            subjects: [],
        })
        setTeacherName("")
        teacherDeleteBtn.current.style.cssText = "display: none;";
    }
    return (
        <>
            <Menubar activeMenuIndex={1} />
            <div className='main-container teachers'>
                <div className='top-sub-container'>
                    <div className='left-sub-container'>
                        <div className='tools-container'>
                            <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                            <SearchBar cardsContainerCurrent={cardsContainer.current} />
                        </div>
                        <Cards
                            cardDetails={teachersList}
                            cardClassName={"teacher-card"}
                            cardClickHandler={teacherCardOnClickHandler}
                            addBtnClickHandler={addTeacherCardClickHandler}
                            cardsContainerRef={cardsContainer} />
                    </div>
                    <div className='right-sub-container'>
                        <DetailsContainer
                            teacherName={teacherName}
                            teacherDetails={teacherDetails}
                            teachersList={teachersList}
                            setTeacherDetails={setTeacherDetails}
                            setTeacherName={setTeacherName}
                            periodCount={periodCount}
                            onSubmitCallBack={startUpFunction}

                            teacherDeleteBtnRef={teacherDeleteBtn}
                        />
                    </div>
                </div>
                <OwnerFooter />
            </div>
        </>
    )
}

function DetailsContainer({
    teacherName = "",
    teacherDetails,
    teachersList,
    setTeacherDetails,
    setTeacherName,
    periodCount,
    onSubmitCallBack,

    teacherDeleteBtnRef
}) {
    const [subjectList, setSubjectList] = useState([]);
    useEffect(() => {
        getSubjectList(setSubjectList)
    }, [])
    function modifyTheValueOfInputBox(time, isSelected) {
        let newDetails = { ...teacherDetails };
        time = JSON.parse(time)
        if (isSelected) {
            let found = -1;
            for (let index = 0; index < newDetails.freeTime.length; index++) {
                if (newDetails.freeTime[index][0] === time[0] && newDetails.freeTime[index][1] === time[1]) {
                    found = index;
                    break
                }
            }
            newDetails.freeTime.splice(found, 1);
        } else {
            newDetails.freeTime.push(time)
        }
        setTeacherDetails(newDetails)
    }
    function inputOnChangeHandler(event) {
        if (event.target.name === 'teacherName') setTeacherName(event.target.value)
        else setTeacherDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }
    function deleteTeacherBtnClickHandler(event) {
        event.preventDefault();
        if (window.confirm("Are you sure? Want to Delete " + teacherName + " ?")) {
            deleteTeacher(teacherName, () => {
                onSubmitCallBack();
            });
        }
    }
    function teacherFormSubmitHandler(event) {
        event.preventDefault();
        verifyInputs()
        //verification of inputs
        function verifyInputs() {
            let teacherData = { ...teacherDetails };
            let newTeacherName = teacherName.trim().toUpperCase();
            if (newTeacherName.length === 0) {
                alert("Please Enter Teacher Name");
                return;
            }
            if (newTeacherName.length > 100) {
                alert("Length of the name must be less than 100");
                return;
            }
            if (teacherData.subjects.length <= 0) {
                alert("Please Enter a Subject")
                return;
            }
            for (let subjectStr of teacherData.subjects) {
                if (subjectList !== "unavailable" && subjectList.indexOf(subjectStr) === -1) {
                    alert("Couldn't find subject - " + subjectStr);
                    return;
                }
            }
            if (teacherData.freeTime.length > 0) {
                try {
                    let jsonInput;
                    try {
                        jsonInput = (teacherData.freeTime);
                    } catch (err) {
                        alert("please enter a vaild time");
                        return;
                    }
                    if (!(jsonInput instanceof Array)) {
                        alert("Please enter a vaild time");
                        return;
                    }
                    for (let slot of jsonInput) {
                        if (!(slot instanceof Array) && !slot.length === 2) {
                            alert("Value must contain integers and length must be 2");
                            return;
                        }
                        if (isNaN(slot[0]) || isNaN(slot[1])) {
                            alert("Value can't be non-numeric or empty");
                            return;
                        }
                    }
                    teacherData.freeTime = jsonInput;
                } catch (err) {
                    console.log("Error in verifying time")
                }
            } else {
                teacherData.freeTime = [];
            }

            if (match(teachersList, teacherName).length > 0) {
                if (window.confirm("Are you want to overwrite " + teacherName)) saveData();
            } else saveData();
            function saveData() {
                let data = new Map();
                data[teacherName] = teacherData;
                saveTeacher(data, () => {
                    alert(JSON.stringify(data) + "---------- is added")
                    onSubmitCallBack();
                })
            }
        }
    }
    return (
        <form className='details-container' onSubmit={teacherFormSubmitHandler}>
            <div className='inputs-container-heading'>Details</div>
            <div className="input-container">
                <div className="input-box-heading">Teacher Name</div>
                <input
                    type="text"
                    className="input-box"
                    name='teacherName'
                    value={teacherName}
                    placeholder='Ex. ABC'
                    onChange={event => {
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Names</div>
                <TagInput
                    tagList={subjectList}
                    inputName={'subjects'}
                    details={teacherDetails}
                    updateWithNewValues={(data) => {
                        let newTeacherDetails = { ...teacherDetails }
                        newTeacherDetails.subjects = data;
                        setTeacherDetails(newTeacherDetails)
                    }}
                />
            </div>
            <div className='input-container'>
                <div>Available Times</div>
                {periodCount &&
                    <TimeSelector
                        modifyTheValueOfInputBox={modifyTheValueOfInputBox}
                        teacherDetails={teacherDetails}
                        periodCount={periodCount} />}
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn' type='submit'>Save</button>
                <button className='teacher-delete-btn' onClick={deleteTeacherBtnClickHandler} ref={teacherDeleteBtnRef}>Delete</button>
            </div>
        </form>
    )
}

function TimeSelector({ modifyTheValueOfInputBox, teacherDetails, periodCount = 8 }) {
    let noOfDays = 5;
    let timeTable = [];
    let newTeacherDetailsFreeTime = teacherDetails.freeTime
    for (let day = 0; day < noOfDays; day++) {
        let teacherDetailsFreeTimeOfThatDay = [];
        for (let index = 0; index < newTeacherDetailsFreeTime.length; index++) {
            if (newTeacherDetailsFreeTime[index][0] === (day + 1))
                teacherDetailsFreeTimeOfThatDay.push(newTeacherDetailsFreeTime[index][1])
        }
        timeTable.push(
            <Periods
                noOfPeriods={periodCount}
                day={day}
                modifyTheValueOfInputBox={modifyTheValueOfInputBox}
                key={day}
                teacherDetailsFreeTimeOfThatDay={teacherDetailsFreeTimeOfThatDay}
            ></Periods>
        )
    }
    return (
        <div className='time-selector'>
            <div className='time-table-container'>
                {timeTable}
            </div>
        </div>
    )
}

function Periods({ noOfPeriods, day, modifyTheValueOfInputBox, teacherDetailsFreeTimeOfThatDay }) {
    let periods = []
    for (let period = 0; period < noOfPeriods; period++) {
        let selectClass = "";
        if (hasElement(teacherDetailsFreeTimeOfThatDay, (period + 1))) {
            selectClass = "selected";
        }
        periods.push(
            <div
                key={period}
                className={'period ' + selectClass}
                onClick={event => periodClickHandler(event, period)}>
                {period + 1}
            </div>
        )
    }

    function periodClickHandler(event, period) {
        let isSelected = hasElement(event.target.classList, "selected");
        modifyTheValueOfInputBox(`[${day + 1},${[period + 1]}]`, isSelected);
    }
    return (
        <div className='periods-container' >
            {periods}
        </div>
    )
}

export default TeachersPage