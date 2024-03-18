import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/TimeTableStructure.css"
import { useEffect, useState } from 'react'
import { getTimeTableStructure, saveTimeTableStructure } from '../Script/TimeTableDataFetcher'
import "../Script/commonJS"

function TimeTableStructurePage() {
    const [fileChange, setFileChange] = useState(false)

    return (
        <>
            <Menubar activeMenuIndex={4} />
            <div className='main-container time-table-structure'>
                <MiniStateContainer callBackAfterStateUpdate={() => { setFileChange(true) }} />
                <TimeTableStructureInputContainer fileChange={fileChange} setFileChange={setFileChange} />
            </div>
        </>
    )
}

function TimeTableStructureInputContainer({ fileChange, setFileChange }) {

    const [timeTableStructureFieldValues, setTimeTableStructureFieldValues] = useState({
        breaksPerSemester: "",
        periodCount: "0",
        sectionsPerSemester: "",
        semesterCount: "0"
    })

    function updateFieldsFromObject(obj) {
        let fieldValues = {
            breaksPerSemester: JSON.stringify(obj.breaksPerSemester).slice(1, -1),
            periodCount: JSON.stringify(obj.periodCount),
            sectionsPerSemester: JSON.stringify(obj.sectionsPerSemester).slice(1, -1),
            semesterCount: JSON.stringify(obj.semesterCount)
        }
        setTimeTableStructureFieldValues(fieldValues)
    }

    useEffect(() => {
        getTimeTableStructure(updateFieldsFromObject)
        setFileChange(false)
    }, [fileChange, setFileChange])

    function inputOnChangeHandler(event) {
        setTimeTableStructureFieldValues(value => ({ ...value, [event.target.name]: event.target.value }))
    }

    function isPositiveWholeNumber(num) {
        if (!Number.isInteger(num) || num < 0 || Number.isNaN(num)) return false
        else return true
    }

    function timeTableStructureOnSubmitHandler(event) {
        event.preventDefault();

        let timeTableStructure = Object()

        //Validating year count
        try {
            let semesterCount = Number.parseInt(timeTableStructureFieldValues.semesterCount)
            if (!isPositiveWholeNumber(semesterCount)) {
                alert("Please enter a valid year count")
                return
            }
            timeTableStructure.semesterCount = semesterCount
        } catch (err) {
            alert("Please enter a valid year count")
            return
        }

        //Validating period count
        try {
            let periodCount = Number.parseInt(timeTableStructureFieldValues.periodCount)
            if (!isPositiveWholeNumber(periodCount)) {
                alert("Please enter a valid period count")
                return
            }
            timeTableStructure.periodCount = periodCount
        } catch (err) {
            alert("Please enter a valid period count")
            return
        }

        //Validating sections per year
        try {
            let sectionsPerSemester = JSON.parse(`[${timeTableStructureFieldValues.sectionsPerSemester}]`)
            if (!((sectionsPerSemester instanceof Array) && sectionsPerSemester.every(
                (value) => isPositiveWholeNumber(value)
            ))) {
                alert("Please enter sections per year in correct format")
                return
            }
            if (sectionsPerSemester.length !== timeTableStructure.semesterCount) {
                alert("Number of year in sections per year must be equal to year count")
                return
            }
            timeTableStructure.sectionsPerSemester = sectionsPerSemester
        } catch (err) {
            alert("Please enter sections per year in correct format")
            return
        }

        //Validating breaks per year
        try {
            let breaksPerSemester = JSON.parse(`[${timeTableStructureFieldValues.breaksPerSemester}]`)
            if (!((breaksPerSemester instanceof Array) && breaksPerSemester.every(
                (subarr) =>
                    (subarr instanceof Array) &&
                    subarr.every(
                        (value) => isPositiveWholeNumber(value)
                    )
            ))) {
                alert("Please enter break locations per year in correct format")
                return
            }
            if (breaksPerSemester.length !== timeTableStructure.semesterCount) {
                alert("Number of semesters in break locations per year must be equal to year count")
                return
            }
            if (
                !((breaksPerSemester instanceof Array) && breaksPerSemester.every(
                    (subarr) =>
                        (subarr instanceof Array) &&
                        subarr.every(
                            (value) => (value <= timeTableStructure.periodCount)
                        )
                ))
            ) {
                alert("Break locations must be lesser than or equal to period count")
                return
            }
            timeTableStructure.breaksPerSemester = breaksPerSemester

        } catch (err) {
            alert("Please enter break locations per year in correct format")
            return
        }

        console.log(timeTableStructure)

        saveTimeTableStructure(timeTableStructure, () => {
            alert(JSON.stringify(timeTableStructure) + "----------- is saved")
        })
    }
    return (
        <form className='time-table-structure-inputs-container' onSubmit={timeTableStructureOnSubmitHandler}>
            <div className='top-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Year</div>
                    <input
                        type='number'
                        className='input-box'
                        min={0}
                        name='semesterCount'
                        value={timeTableStructureFieldValues.semesterCount}
                        onChange={inputOnChangeHandler} />
                </div>
                <div className="input-container">
                    <div className="input-box-heading">Number of Periods per Day</div>
                    <input
                        type='number'
                        className='input-box'
                        min={0} name='periodCount'
                        value={timeTableStructureFieldValues.periodCount}
                        onChange={inputOnChangeHandler} />
                </div>
            </div>

            <div className='mid-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Sections per Year</div>
                    <input
                        type='text'
                        className='input-box'
                        name='sectionsPerSemester'
                        value={timeTableStructureFieldValues.sectionsPerSemester}
                        onChange={inputOnChangeHandler} />
                </div>
            </div>
            <div className='bottom-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Break Times per Year</div>
                    <input
                        type='text'
                        className='input-box'
                        name='breaksPerSemester'
                        value={timeTableStructureFieldValues.breaksPerSemester}
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