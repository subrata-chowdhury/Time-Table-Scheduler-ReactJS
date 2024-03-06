import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import Cards from '../Components/Cards'
import { InputBox } from '../Components/BasicComponents'
import "../Style/Teachers.css"
import { useEffect, useState } from 'react'
import SearchBar from '../Components/SearchBar'
import { getTeacherList } from '../Script/TeachersDataFetcher'

function TeachersPage() {
    const [teachersList, setTeahersList] = useState([]);
    useEffect(() => {
        getTeacherList(setTeahersList);
    }, [])
    return (
        <>
            <Menubar activeMenuIndex={1} />
            <div className='main-container teachers'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer />
                        <SearchBar />
                    </div>
                    <Cards cardDetails={teachersList} cardClassName={"teacher-card"} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer />
                </div>
            </div>
        </>
    )
}

function DetailsContainer() {
    const [availableTime, setAvailableTime] = useState([]);

    function modifyTheValueOfInputBox(time, isSelected) {
        let newArr = [...availableTime];
        if (isSelected) {
            newArr.splice(newArr.indexOf(time), 1);
        } else newArr.push(time)
        setAvailableTime(newArr)
    }
    return (
        <div className='details-container'>
            <div className='inputs-container-heading'>Details</div>
            <InputBox inputHeading='Teacher Name' placeholder='Ex.: ABC' />
            <InputBox inputHeading='Subject Names' placeholder="Ex. PCC-CS501, PCC-CS502, .." />
            <div className='input-container'>
                <div>Available Times</div>
                <TimeSelector modifyTheValueOfInputBox={modifyTheValueOfInputBox} />
            </div>
            <div className="input-container">
                <div className="input-box-heading">Available Times</div>
                <input type="text" className="input-box" readOnly={true} value={availableTime}></input>
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn'>Save</button>
            </div>
        </div>
    )
}

function TimeSelector({ modifyTheValueOfInputBox }) {
    let noOfDays = 5;
    let noOfPeriodsPerDay = 8;
    let timeTable = [];
    for (let day = 0; day < noOfDays; day++) {
        timeTable.push(<Periods noOfPeriods={noOfPeriodsPerDay} day={day} modifyTheValueOfInputBox={modifyTheValueOfInputBox} key={day}></Periods>)
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