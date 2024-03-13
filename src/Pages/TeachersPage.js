import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import Cards from '../Components/Cards'
import "../Style/Teachers.css"
import { useEffect, useState } from 'react'
import SearchBar from '../Components/SearchBar'
import { deleteTeacher, getTeacher, getTeacherList, saveTeacher } from '../Script/TeachersDataFetcher'
import { getTimeTableStructure } from '../Script/TimeTableDataFetcher'
import { getSubjectList } from '../Script/SubjectsDataFetcher'

function TeachersPage() {
    const [teachersList, setTeahersList] = useState([]);
    const [teacherDetails, setTeacherDetails] = useState({
        freeTime: [],
        subjects: [],
    })
    const [teacherName, setTeacherName] = useState();
    const [periodCount, setPeriodCount] = useState();

    useEffect(() => {
        startUpFunction()
    }, [])
    function startUpFunction() {
        getTeacherList(setTeahersList);
        setTeacherDetails({
            freeTime: [],
            subjects: [],
        })
        setTeacherName()
        getTimeTableStructure((timeTableStructure) => { setPeriodCount(timeTableStructure.periodCount) })
    }
    function teacherCardOnClickHandler(event) {
        getTeacher(event.target.title, setTeacherDetailsControler);
        function setTeacherDetailsControler(data) {
            data.subjects = data.subjects.join(";")
            setTeacherDetails(data)
        }
        setTeacherName(event.target.title);
        document.querySelector('button.teacher-delete-btn').style.cssText = "display: block";
    }
    function addTeacherCardClickHandler() {
        setTeacherDetails({
            freeTime: [],
            subjects: [],
        })
        setTeacherName("")
        document.querySelector("form button.teacher-delete-btn").style.cssText = "display: none;";
    }
    return (
        <>
            <Menubar activeMenuIndex={1} />
            <div className='main-container teachers'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                        <SearchBar />
                    </div>
                    <Cards
                        cardDetails={teachersList}
                        cardClassName={"teacher-card"}
                        cardClickHandler={teacherCardOnClickHandler}
                        addBtnClickHandler={addTeacherCardClickHandler} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        teacherName={teacherName}
                        teacherDetails={teacherDetails}
                        setTeacherDetails={setTeacherDetails}
                        setTeacherName={setTeacherName}
                        periodCount={periodCount}
                        setTeahersList={setTeahersList}
                    />
                </div>
            </div>
        </>
    )
}

function DetailsContainer({
    teacherName = "",
    teacherDetails,
    setTeacherDetails,
    setTeacherName,
    periodCount,
    setTeahersList
}) {
    function modifyTheValueOfInputBox(time, isSelected) {
        let newDetails = { ...teacherDetails };
        if (isSelected) {
            newDetails.freeTime.splice(newDetails.freeTime.indexOf(time), 1);
        } else newDetails.freeTime.push(time)
        setTeacherDetails(newDetails)
    }
    function inputOnChangeHandler(event) {
        if (event.target.name === 'teacherName') setTeacherName(event.target.value)
        else setTeacherDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }
    function deleteTeacherBtnClickHandler(event) {
        event.preventDefault();
        if (window.confirm("Are you sure? Want to Delete " + teacherName + " ?")) {
            deleteTeacher(teacherName, ()=>{
                clearInputs();
                getTeacherList(setTeahersList);
            });
            function clearInputs() {
                setTeacherDetails({
                    freeTime: [],
                    subjects: [],
                })
                setTeacherName("")
            }
        }
    }
    function teacherFormSubmitHandler(event) {
        event.preventDefault();
        let teacherData = { ...teacherDetails };
        let newTeacherName = teacherName.trim().toUpperCase();
        getSubjectList(verifyInputs)
        //verification of inputs
        function verifyInputs(subjectList) {
            if (newTeacherName.length === 0) {
                alert("Please Enter Teacher Name");
                return;
            }
            if (newTeacherName.length > 9) {
                alert("Length of the name must be less than 10");
                return;
            }
            if (teacherData.subjects.length <= 0) {
                alert("Please Enter a Subject")
                return;
            } else {
                teacherData.subjects = teacherData.subjects.trim().toUpperCase().split(";");
            }
            for (let subjectStr of teacherData.subjects) {
                if (subjectList !== "unavailable" && subjectList.indexOf(subjectStr) === -1) {
                    alert("Couldn't find subject - " + subjectStr);
                    return;
                }
            }
            if (teacherData.freeTime.length > 0) {
                teacherData.freeTime = `[${teacherData.freeTime}]`
                try {
                    let jsonInput;
                    try {
                        jsonInput = JSON.parse(teacherData.freeTime);
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
                } catch (err) {
                    console.log("Error in verifying time")
                }
            }
            let data = new Map();
            data[teacherName] = teacherData;
            saveTeacher(data, () => {
                getTeacherList(setTeahersList)
                alert(JSON.stringify(data) + "---------- is added")
            })
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
                <input
                    type="text"
                    className="input-box"
                    name='subjects'
                    value={teacherDetails.subjects}
                    placeholder='Ex. PCC-CS501, PCC-CS502, ..'
                    onChange={event => {
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className='input-container'>
                <div>Available Times</div>
                {periodCount &&
                    <TimeSelector
                        modifyTheValueOfInputBox={modifyTheValueOfInputBox}
                        teacherDetails={teacherDetails}
                        periodCount={periodCount} />}
            </div>
            <div className="input-container">
                <div className="input-box-heading">Available Times</div>
                <input
                    type="text"
                    className="input-box"
                    value={teacherDetails.freeTime}
                    onChange={event => {
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn' type='submit'>Save</button>
                <button className='teacher-delete-btn' onClick={deleteTeacherBtnClickHandler}>Delete</button>
            </div>
        </form>
    )
}

function TimeSelector({ modifyTheValueOfInputBox, teacherDetails, periodCount = 8 }) {
    let noOfDays = 5;
    let timeTable = [];
    for (let day = 0; day < noOfDays; day++) {
        timeTable.push(
            <Periods
                noOfPeriods={periodCount}
                day={day}
                modifyTheValueOfInputBox={modifyTheValueOfInputBox}
                key={day}
                teacherDetails={teacherDetails}
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

function Periods({ noOfPeriods, day, modifyTheValueOfInputBox, teacherDetails }) {
    let periods = []
    for (let period = 0; period < noOfPeriods; period++) {
        periods.push(
            <div key={period} className='period' data-time={`[${day + 1},${[period + 1]}]`} onClick={event => periodClickHandler(event, period)}>
                {period + 1}
            </div>
        )
    }

    function periodClickHandler(event, period) {
        let isSelected = hasElement(event.target.classList, "selected");
        selectDeselectPeriod(isSelected, event.target);
        modifyTheValueOfInputBox(`[${day + 1},${[period + 1]}]`, isSelected);
    }
    function selectDeselectPeriod(isSelected, target) {
        if (isSelected) target.classList.remove("selected");
        else target.classList.add("selected")
    }
    return (
        <div className='periods-container' >
            {periods}
        </div>
    )
}

function hasElement(array, find) {
    for (let index = 0; index < array.length; index++) {
        if (array[index] === find) return true
    }
    return false
}

export default TeachersPage