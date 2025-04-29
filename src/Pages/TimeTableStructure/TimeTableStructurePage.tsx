import MiniStateContainer from '../../Components/MiniStateContainer'
import "../../Style/Pages/TimeTableStructure.css"
import React, { FormEvent, memo, useCallback, useEffect, useState } from 'react'
import { getTimeTableStructure, saveTimeTableStructure } from '../../Script/TimeTableDataFetcher'
import verifyTimeTableStructureInputs from '../../Script/InputVerifiers/TimeTableStructureVerifier'
import { TimeTableStructure } from '../../data/Types'
import TagInput from '../../Components/TagInput'
import { useAlert } from '../../Components/AlertContextProvider'
import CheckBox from '../../Components/CheckBox'
import { getConfigLocaly, setConfigLocaly } from '../../Script/configFetchers'

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
        semesterCount: 4,
        dayCount: 5
    })
    const [startingDay, setStartingDay] = useState<string>("Tue");

    const { showWarning, showSuccess, showError } = useAlert()

    useEffect(() => {
        getTimeTableStructure(setTimeTableStructureFieldValues) // api call
        getConfigLocaly('startingDay', (val) => {
            if (val) {
                setStartingDay(val)
            }
        }, () => { })
    }, [fileChange])

    const inputOnChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'semesterCount':
                if (event.target.value === '' || Number(event.target.value) < 1) event.target.value = '1'
                setTimeTableStructureFieldValues(value => {
                    let newBreaksPerSemester = [...value.breaksPerSemester]
                    let newSectionsPerSemester = [...value.sectionsPerSemester]
                    if (Number(event.target.value) < value.semesterCount) {
                        newBreaksPerSemester = newBreaksPerSemester.slice(0, Number(event.target.value))
                        newSectionsPerSemester = newSectionsPerSemester.slice(0, Number(event.target.value))
                    }
                    if (Number(event.target.value) > value.semesterCount)
                        for (let index = value.semesterCount; index < Number(event.target.value); index++) {
                            newBreaksPerSemester[index] = [2]
                            newSectionsPerSemester[index] = 0
                        }
                    return {
                        ...value,
                        semesterCount: Number(event.target.value),
                        breaksPerSemester: newBreaksPerSemester,
                        sectionsPerSemester: newSectionsPerSemester
                    }
                })
                break
            case 'periodCount':
                if (event.target.value === '' || Number(event.target.value) < 4) event.target.value = '4'
                setTimeTableStructureFieldValues(value => ({ ...value, periodCount: Number(event.target.value) }))
                break
        }
    }, [])

    const timeTableStructureOnSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let timeTableStructure = verifyTimeTableStructureInputs(timeTableStructureFieldValues, showWarning)
        if (timeTableStructure) {
            saveTimeTableStructure(timeTableStructure, () => { // api call
                showSuccess(JSON.stringify(timeTableStructure, null, 2) + "----------- is saved")
            }, (msg) => showError(msg || "Someting went Wrong!"));
            setConfigLocaly('startingDay', startingDay, () => { }, () => { })
        }
    }, [timeTableStructureFieldValues, startingDay])

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
                        {timeTableStructureFieldValues.sectionsPerSemester.length > 0 && timeTableStructureFieldValues.sectionsPerSemester.map((value, index) => (
                            <input
                                key={index}
                                type='number'
                                className='input-box'
                                min={0}
                                name='sectionsPerSemester'
                                value={value.toString() || 0}
                                onChange={(e) => {
                                    setTimeTableStructureFieldValues(prev => {
                                        let temp = [...prev.sectionsPerSemester]
                                        temp[index] = Number(e.target.value)
                                        return { ...prev, sectionsPerSemester: temp }
                                    })
                                }} />
                        ))}
                    </div>
                </div>
            </div>
            <div className='bottom-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Break Times per Year</div>
                    <div className='input-grp'>
                        {timeTableStructureFieldValues.breaksPerSemester.length > 0 && timeTableStructureFieldValues.breaksPerSemester.map((value, index) => (
                            <div className='sub-input-grp' key={index}>
                                <TagInput
                                    tagList={value.map(val => String(val))}
                                    onChange={newVal => {
                                        setTimeTableStructureFieldValues(prev => {
                                            let newBreaksPerSemester = [...prev.breaksPerSemester]
                                            newBreaksPerSemester[index] = newVal.map((value) => Number(value)).filter((value) => value > 0)
                                            return { ...prev, breaksPerSemester: newBreaksPerSemester }
                                        })
                                    }}
                                    validTags={timeTableStructureFieldValues.periodCount > 0 ? Array.from({ length: timeTableStructureFieldValues.periodCount }, (_, i) => (i + 1).toString()) : undefined} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div style={{ marginBottom: 10 }} className="input-container">
                    <div className="input-box-heading">Days per Week</div>
                    <input
                        type='number'
                        className='input-box'
                        min={4} name='dayCount'
                        value={timeTableStructureFieldValues.dayCount}
                        onChange={(e) => { setTimeTableStructureFieldValues({ ...timeTableStructureFieldValues, dayCount: parseInt(e.target.value) ?? 5 }) }} />
                </div>
                <div style={{ marginBottom: 8 }}>Starting Day</div>
                <div className='checkbox-for-days-container'>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                        <CheckBox
                            key={index}
                            label={day}
                            value={startingDay === day}
                            hideTick={true}
                            onChange={(val) => {
                                if (val) setStartingDay(day)
                            }} />))}
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='time-table-structure-save-btn' type='submit'>Update</button>
            </div>
        </form>
    )
}
export default memo(TimeTableStructurePage)