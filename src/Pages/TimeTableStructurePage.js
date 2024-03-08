import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/TimeTableStructure.css"
import { useEffect, useState } from 'react'
import { getTimeTableStructure } from '../Script/TimeTableDataFetcher'

function TimeTableStructurePage() {
    return (
        <>
            <Menubar activeMenuIndex={4} />
            <div className='main-container time-table-structure'>
                <MiniStateContainer />
                <TimeTableStructureInputContainer />
            </div>
        </>
    )
}

function TimeTableStructureInputContainer() {
    const [timeTableStructure, setTimeTableStructure] = useState({
        breaksPerSemester: [],
        periodCount: 0,
        sectionsPerSemester: [],
        semesterCount: 0,
    })
    useEffect(() => {
        getTimeTableStructure(setTimeTableStructure)
    }, [])
    function inputOnChangeHandler(event) {
        setTimeTableStructure(value => ({ ...value, [event.target.name]: event.target.value }))
    }
    function timeTableStructureOnSubmitHandler(event) {
        event.preventDefault();
        alert(JSON.stringify(timeTableStructure))
    }
    return (
        <form className='time-table-structure-inputs-container' onSubmit={timeTableStructureOnSubmitHandler}>
            <div className='top-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Semester</div>
                    <input
                        type='number'
                        className='input-box'
                        min={0}
                        name='semesterCount'
                        value={timeTableStructure.semesterCount}
                        onChange={inputOnChangeHandler} />
                </div>
                <div className="input-container">
                    <div className="input-box-heading">Number of Periods per Day</div>
                    <input
                        type='number'
                        className='input-box'
                        min={0} name='periodCount'
                        value={timeTableStructure.periodCount}
                        onChange={inputOnChangeHandler} />
                </div>
            </div>

            <div className='mid-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Sections per Semester</div>
                    <input
                        type='text'
                        className='input-box'
                        name='sectionsPerSemester'
                        value={timeTableStructure.sectionsPerSemester}
                        onChange={inputOnChangeHandler} />
                </div>
            </div>
            <div className='bottom-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Break Times per Semester</div>
                    <input
                        type='text'
                        className='input-box'
                        name='breaksPerSemester'
                        value={JSON.stringify(timeTableStructure.breaksPerSemester).slice(1, -1)}
                        onChange={inputOnChangeHandler} />
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='time-table-structure-save-btn' type='submit'>Update</button>
            </div>
        </form>
    )
}
export default TimeTableStructurePage