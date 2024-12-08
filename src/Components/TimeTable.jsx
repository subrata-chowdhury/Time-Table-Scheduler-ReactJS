import React, { memo } from "react";
import { hasElement } from "../Script/util";
import "../Style/TimeTable.css";

export let emptyTimeTableDetails = [
    [[null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]],
    [[null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]],
    [[null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]],
    [[null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]],
    [[null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]
];

const TimeTable = ({
    // noOfDays = 5,
    noOfPeriods = 9,
    breakTimeIndexs = [4],
    dayNames = ["Tue", "Wed", "Thu", "Fri", "Sat"],
    periodTimes = ["9:30AM", "10:20AM", "11:10AM", "12:00PM", "12:50PM", "01:40PM", "02:30PM", "03:20PM", "04:10PM"],
    details = emptyTimeTableDetails,
    subjectIndexAtPeriodElementInDetails = 1,
    subjectsDetails,
    periodClickHandler = () => { },
    className = "",
    // timeTableWidthInPercent = 95,
}) => {
    if (details.length <= 0)
        return <></>;
    const breakWord = "BREAK";
    let dayRows = [];
    if (details)
        if (dayNames.length === details.length && subjectsDetails) {
            for (let i = 0; i < details.length; i++) {
                dayRows.push(
                    <DaysRow
                        key={i}
                        dayIndex={i}
                        noOfPeriods={noOfPeriods}
                        details={details[i]}
                        breakWord={breakWord[i]}
                        subjectsDetails={subjectsDetails}
                        breakTimeIndexs={breakTimeIndexs}
                        subjectIndexAtPeriodElementInDetails={subjectIndexAtPeriodElementInDetails}
                        dayName={dayNames[i]}
                        periodClickHandler={periodClickHandler} />);
            }
        }
        else {
            dayRows.push(<div className="invalid-text" key={"error"}>Invalid Data</div>);
        }
    else
        dayRows.push(
            <div className="text" style={{ display: "grid", justifyContent: "center", alignItems: "center" }} key={"error"}>
                No Scedule Found <br />or <br />Time Table was not Generated Yet
            </div>
        );

    return (
        <div className={"time-table-container " + className}>
            <div className="period-times-container" style={{ gridTemplateColumns: `repeat(${noOfPeriods + 1},1fr)` }}>
                <div className="column-row-identifier">
                    <span className="column-indentifier">Day\
                        <span className="row-indentifier">Time</span>
                    </span>
                </div>
                {periodTimes && periodTimes.length > 0 && periodTimes.map((time) => (<div className="time" key={time}>{time}</div>))}
            </div>
            {dayRows}
        </div>
    );
};

const DaysRow = ({
    noOfPeriods = 9,
    dayIndex,
    details,
    breakWord,
    subjectsDetails,
    breakTimeIndexs,
    dayName,
    subjectIndexAtPeriodElementInDetails,
    periodClickHandler = () => { }
}) => {
    let periodCompIndex = 1;
    let timeTableDataInteratorIndex = 0;
    let infiniteLoopPreventerIndex = 0;
    let DayElements = [];
    if (!details)
        return <div className='time-table-error-text'>NO TIME TABLE FOUND / OR AN ERROR OCCURED</div>;

    while (periodCompIndex <= noOfPeriods && timeTableDataInteratorIndex < details.length && infiniteLoopPreventerIndex < 50) {
        let periodDetails = details[timeTableDataInteratorIndex];
        if (hasElement(breakTimeIndexs, periodCompIndex)) {
            DayElements.push(<div className="period-details-container break">
                <div> </div>
                <div> {breakWord} </div>
                <div> </div>
            </div>);
        }
        else {
            if (periodDetails === null) {
                DayElements.push(
                    <PeriodComp
                        key={timeTableDataInteratorIndex}
                        periodDetails={null}
                        dayIndex={dayIndex}
                        periodIndex={timeTableDataInteratorIndex}
                        onClick={() => { }} />);
            }
            else if (periodDetails !== null && periodDetails && periodDetails[subjectIndexAtPeriodElementInDetails]) {
                const isLab = (periodDetails[subjectIndexAtPeriodElementInDetails].toUpperCase() === "Subject".toUpperCase())
                    || (periodDetails[subjectIndexAtPeriodElementInDetails].toUpperCase() === "Lab".toUpperCase())
                    || subjectsDetails[periodDetails[subjectIndexAtPeriodElementInDetails]] === undefined ?
                    false
                    : subjectsDetails[periodDetails[subjectIndexAtPeriodElementInDetails]].isPractical;
                DayElements.push(
                    <PeriodComp
                        key={timeTableDataInteratorIndex}
                        periodDetails={periodDetails}
                        dayIndex={dayIndex}
                        periodIndex={timeTableDataInteratorIndex}
                        isLab={isLab}
                        onClick={periodClickHandler} />);
                if (isLab) {
                    timeTableDataInteratorIndex += 2;
                    periodCompIndex += 2;
                } //+2 beacause in outer block it will increament which will cause +3
            }
            else
                DayElements.push(
                    <PeriodComp
                        key={timeTableDataInteratorIndex}
                        periodDetails={periodDetails}
                        dayIndex={dayIndex}
                        periodIndex={timeTableDataInteratorIndex}
                        onClick={periodClickHandler} />);
        }
        timeTableDataInteratorIndex++;
        periodCompIndex++;
        infiniteLoopPreventerIndex++;
        if (infiniteLoopPreventerIndex === 49) {
            DayElements = [];
            DayElements.push(<div>Error In Data</div>);
        }
    }
    return (
        <div className="day-container" style={{ gridTemplateColumns: `repeat(${noOfPeriods + 1},1fr)` }}>
            <div className="day-name">{dayName}</div>
            {DayElements}
        </div>
    );
};

const PeriodComp = ({ periodDetails = [], dayIndex, periodIndex, isLab = false, onClick = () => { } }) => {
    let modifiedPeriodDetails;
    if (periodDetails) {
        modifiedPeriodDetails = [...periodDetails]; // copying the values because original value modification causeing issue
        if (modifiedPeriodDetails && modifiedPeriodDetails.length > 1) {
            const temp = modifiedPeriodDetails[0];
            modifiedPeriodDetails[0] = modifiedPeriodDetails[1];
            modifiedPeriodDetails[1] = temp;
        }
    }

    return (
        <div className="period-details-container class" style={isLab ? { gridColumn: 'auto / span 3' } : {}} onClick={() => onClick(dayIndex, periodIndex)}>
            {modifiedPeriodDetails && modifiedPeriodDetails?.length > 0 && modifiedPeriodDetails.map((detail, index) => (<div key={index}>{detail}</div>))}
            {!periodDetails && <>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
            </>}
        </div>
    );
};

export default memo(TimeTable);
