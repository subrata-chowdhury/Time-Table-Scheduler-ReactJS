import MiniStateContainer from '../../Components/MiniStateContainer';
import "../../Style/Pages/TimeTableStructure.css";
import React, { memo, useCallback, useEffect, useState } from 'react';
import { getTimeTableStructure, saveTimeTableStructure } from '../../Script/TimeTableDataFetcher';
import verifyTimeTableStructureInputs from '../../Script/InputVerifiers/TimeTableStructureVerifier';
import TagInput from '../../Components/TagInput';

function TimeTableStructurePage() {
    return (
        <>
            <div className='page time-table-structure'>
                <MainComponents />
            </div>
        </>
    );
}

function MainComponents() {
    const [fileChange, setFileChange] = useState(false);

    return (
        <div className='top-sub-container'>
            <MiniStateContainer onChange={() => { setFileChange(val => !val); }} />
            <TimeTableStructureInputContainer fileChange={fileChange} />
        </div>
    );
}

const TimeTableStructureInputContainer = ({ fileChange }) => {
    const [timeTableStructureFieldValues, setTimeTableStructureFieldValues] = useState({
        breaksPerSemester: [[0], [0], [4, 5], [4]],
        periodCount: 9,
        sectionsPerSemester: [0, 0, 3, 0],
        semesterCount: 4
    });

    useEffect(() => {
        getTimeTableStructure(setTimeTableStructureFieldValues); // api call
    }, [fileChange]);

    const inputOnChangeHandler = useCallback((event) => {
        switch (event.target.name) {
            case 'semesterCount':
                if (event.target.value === '' || Number(event.target.value) < 1)
                    event.target.value = '1';
                setTimeTableStructureFieldValues(value => {
                    let newBreaksPerSemester = [...value.breaksPerSemester];
                    let newSectionsPerSemester = [...value.sectionsPerSemester];
                    if (Number(event.target.value) < value.semesterCount) {
                        newBreaksPerSemester = newBreaksPerSemester.slice(0, Number(event.target.value));
                        newSectionsPerSemester = newSectionsPerSemester.slice(0, Number(event.target.value));
                    }
                    if (Number(event.target.value) > value.semesterCount)
                        for (let index = value.semesterCount; index < Number(event.target.value); index++) {
                            newBreaksPerSemester[index] = [2];
                            newSectionsPerSemester[index] = 0;
                        }
                    return {
                        ...value,
                        semesterCount: Number(event.target.value),
                        breaksPerSemester: newBreaksPerSemester,
                        sectionsPerSemester: newSectionsPerSemester
                    };
                });
                break;
            case 'periodCount':
                if (event.target.value === '' || Number(event.target.value) < 4)
                    event.target.value = '4';
                setTimeTableStructureFieldValues(value => ({ ...value, periodCount: Number(event.target.value) }));
                break;
        }
    }, []);

    const timeTableStructureOnSubmitHandler = useCallback((event) => {
        event.preventDefault();
        let timeTableStructure = verifyTimeTableStructureInputs(timeTableStructureFieldValues);
        if (timeTableStructure) {
            saveTimeTableStructure(timeTableStructure, () => {
                alert(JSON.stringify(timeTableStructure) + "----------- is saved");
            });
        }
    }, [timeTableStructureFieldValues]);

    return (
        <form className='time-table-structure-inputs-container' onSubmit={timeTableStructureOnSubmitHandler}>
            <div className='top-input-container input-grp'>
                <div className="input-container">
                    <div className="input-box-heading">Number of Year</div>
                    <input
                        type='number'
                        className='input-box'
                        min={1} name='semesterCount'
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
                                        let temp = [...prev.sectionsPerSemester];
                                        temp[index] = Number(e.target.value);
                                        return { ...prev, sectionsPerSemester: temp };
                                    });
                                }} />))}
                    </div>
                </div>
            </div>
            <div className='bottom-input-container'>
                <div className="input-container">
                    <div className="input-box-heading">Break Times per Year</div>
                    <div className='input-grp'>
                        {timeTableStructureFieldValues.breaksPerSemester.length > 0 && timeTableStructureFieldValues.breaksPerSemester.map((value, index) => (
                            <div className='sub-input-grp' key={index}>
                                <TagInput tagList={value.map(val => String(val))} onChange={newVal => {
                                    setTimeTableStructureFieldValues(prev => {
                                        let newBreaksPerSemester = [...prev.breaksPerSemester];
                                        newBreaksPerSemester[index] = newVal.map((value) => Number(value)).filter((value) => value > 0);
                                        return { ...prev, breaksPerSemester: newBreaksPerSemester };
                                    });
                                }} />
                            </div>))}
                    </div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='time-table-structure-save-btn' type='submit'>Update</button>
            </div>
        </form>
    );
};

export default memo(TimeTableStructurePage);
