import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import Cards from '../Components/Cards'
import "../Style/Teachers.css"
import { useEffect, useState } from 'react'
import SearchBar from '../Components/SearchBar'
import { deleteTeacher, getTeacher, getTeacherList } from '../Script/TeachersDataFetcher'
import { getTimeTableStructure } from '../Script/TimeTableDataFetcher'

function TeachersPage() {
    const [teachersList, setTeahersList] = useState([]);
    const [teacherDetails, setTeacherDetails] = useState({
        freeTime: [],
        subjects: [],
    })
    const [teacherName, setTeacherName] = useState();

    useEffect(() => {
        getTeacherList(setTeahersList);
    }, [])

    function teacherCardOnClickHandler(event) {
        getTeacher(event.target.title, setTeacherDetails);
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
                        <MiniStateContainer />
                        <SearchBar />
                    </div>
                    <Cards cardDetails={teachersList} cardClassName={"teacher-card"} cardClickHandler={teacherCardOnClickHandler} addBtnClickHandler={addTeacherCardClickHandler} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        teacherName={teacherName}
                        teacherDetails={teacherDetails}
                        setTeacherDetails={setTeacherDetails}
                        setTeacherName={setTeacherName} />
                </div>
            </div>
        </>
    )
}

function DetailsContainer({
    teacherName = "",
    teacherDetails,
    setTeacherDetails,
    setTeacherName
}) {
    const [availableTime, setAvailableTime] = useState([]);

    function modifyTheValueOfInputBox(time, isSelected) {
        let newArr = [...availableTime];
        if (isSelected) {
            newArr.splice(newArr.indexOf(time), 1);
        } else newArr.push(time)
        setAvailableTime(newArr)
        setTeacherDetails(value => ({ ...value, "freeTime": newArr }))
    }
    function inputOnChangeHandler(event) {
        if (event.target.name === 'teacherName') setTeacherName(event.target.value)
        else setTeacherDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }
    function deleteTeacherBtnClickHandler() {
        if (window.confirm("Are you sure? Want to Delete " + teacherName + " ?")) {
            deleteTeacher(teacherName, clearInputs);
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
                <TimeSelector modifyTheValueOfInputBox={modifyTheValueOfInputBox} />
            </div>
            <div className="input-container">
                <div className="input-box-heading">Available Times</div>
                <input type="text" className="input-box" readOnly={true} value={availableTime}></input>
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn' type='submit'>Save</button>
                <button className='teacher-delete-btn' onClick={deleteTeacherBtnClickHandler}>Delete</button>
            </div>
        </form>
    )
}

function TimeSelector({ modifyTheValueOfInputBox }) {
    const [periodCount, setPeriodCount] = useState(8)
    getTimeTableStructure(createTimeTable)
    function createTimeTable(timeTableStructure) {
        setPeriodCount(timeTableStructure.periodCount);
    }

    let noOfDays = 5;
    let timeTable = [];
    for (let day = 0; day < noOfDays; day++) {
        timeTable.push(<Periods noOfPeriods={periodCount} day={day} modifyTheValueOfInputBox={modifyTheValueOfInputBox} key={day}></Periods>)
    }
    return (
        <div className='time-selector'>
            <div className='time-table-container'>
                {timeTable}
            </div>
        </div>
    )
}

function Periods({ noOfPeriods, day, modifyTheValueOfInputBox }) {
    let periods = []
    for (let period = 0; period < noOfPeriods; period++) {
        periods.push(<div key={period} className='period' onClick={event => periodClickHandler(event, period)}>{period + 1}</div>)
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
        <div className='periods-container'>
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