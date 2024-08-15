import MiniStateContainer from '../../Components/MiniStateContainer'
import "../../Style/Pages/TimeTableStructure.css"
import React, { FormEvent, memo, useCallback, useEffect, useState } from 'react'
import { getTimeTableStructure, saveTimeTableStructure } from '../../Script/TimeTableDataFetcher'
import "../../Script/commonJS"
import verifyTimeTableStructureInputs from '../../Script/InputVerifiers/TimeTableStructureVerifier'
import { TimeTableStructure } from '../../data/Types'
import TagInput from '../../Components/TagInput'

function TimeTableStructurePage() {
    return (
        <>
            <div className='page time-table-structure'>
                <MainComponents />
            </div>
        </>
    )
}

function MainComponents() {
    const [fileChange, setFileChange] = useState(false)
    return (
        <div className='top-sub-container'>
            <MiniStateContainer onChange={() => { setFileChange(val => !val) }} />
            <TimeTableStructureInputContainer fileChange={fileChange} />
        </div>
    )
}

interface TimeTableStructureInputContainerProps {
    fileChange: boolean
}

const TimeTableStructureInputContainer: React.FC<TimeTableStructureInputContainerProps> = ({ fileChange }) => {

    const [timeTableStructureFieldValues, setTimeTableStructureFieldValues] = useState<TimeTableStructure>({
        breaksPerSemester: [[0], [0], [4, 5], [4]],
        periodCount: 9,
        sectionsPerSemester: [0, 0, 3, 0],
        semesterCount: 4
    })

    useEffect(() => {
        getTimeTableStructure(setTimeTableStructureFieldValues) // api call
    }, [fileChange])

    const inputOnChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'semesterCount':
                if (event.target.value === '' || Number(event.target.value) < 1) event.target.value = '1'
                setTimeTableStructureFieldValues(value => ({ ...value, semesterCount: Number(event.target.value) }))
                break
            case 'periodCount':
                if (event.target.value === '' || Number(event.target.value) < 4) event.target.value = '4'
                setTimeTableStructureFieldValues(value => ({ ...value, periodCount: Number(event.target.value) }))
                break
        }
    }, [])

    const timeTableStructureOnSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let timeTableStructure = verifyTimeTableStructureInputs(timeTableStructureFieldValues)
        if (timeTableStructure) {
            saveTimeTableStructure(timeTableStructure, () => { // api call
                alert(JSON.stringify(timeTableStructure) + "----------- is saved")
            })
        }
    }, [timeTableStructureFieldValues])

    let sectionsPerSemester = []
    for (let index = 0; index < timeTableStructureFieldValues.semesterCount; index++) {
        sectionsPerSemester.push(
            <input
                key={index}
                type='number'
                className='input-box'
                min={0}
                name='sectionsPerSemester'
                value={timeTableStructureFieldValues.sectionsPerSemester[index]?.toString() || 0}
                onChange={(e) => {
                    setTimeTableStructureFieldValues(prev => {
                        let temp = [...prev.sectionsPerSemester]
                        temp[index] = Number(e.target.value)
                        return { ...prev, sectionsPerSemester: temp }
                    })
                }} />
        )
    }

    let breaksPerSemester = []
    for (let index = 0; index < timeTableStructureFieldValues.semesterCount; index++) {
        breaksPerSemester.push(
            <div className='sub-input-grp' key={index}>
                <TagInput tagList={timeTableStructureFieldValues.breaksPerSemester[index].map(val => String(val))} onChange={newVal => {
                    setTimeTableStructureFieldValues(prev => {
                        let newBreaksPerSemester = [...prev.breaksPerSemester]
                        newBreaksPerSemester[index] = newVal.map((value) => Number(value)).filter((value) => value > 0)
                        return { ...prev, breaksPerSemester: newBreaksPerSemester }
                    })
                }} />
            </div>
        )
    }

    return (
        <form className='time-table-structure-inputs-container' onSubmit={timeTableStructureOnSubmitHandler}>
            <div className='top-input-container input-grp'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Year</div>
                    <input
                        type='number'
                        className='input-box'
                        min={1}
                        name='semesterCount'
                        value={timeTableStructureFieldValues.semesterCount}
                        onChange={inputOnChangeHandler} />
                </div>
                <div className="input-container">
                    <div className="input-box-heading">Number of Periods per Day</div>
                    <input
                        type='number'
                        className='input-box'
                        min={4} name='periodCount'
                        value={timeTableStructureFieldValues.periodCount}
                        onChange={inputOnChangeHandler} />
                </div>
            </div>

            <div className='mid-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Sections per Year</div>
                    <div className='input-grp'>
                        {sectionsPerSemester}
                    </div>
                </div>
            </div>
            <div className='bottom-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Break Times per Year</div>
                    <div className='input-grp'>
                        {breaksPerSemester}
                    </div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='time-table-structure-save-btn' type='submit'>Update</button>
            </div>
        </form>
    )
}
export default memo(TimeTableStructurePage)