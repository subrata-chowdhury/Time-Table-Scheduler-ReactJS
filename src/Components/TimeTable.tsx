import React, { memo } from "react";
import { hasElement } from "../Script/util.ts";
import "../Style/TimeTable.css"
import { TimeTable as TimeTableType, Subject, TeacherSchedule, Day, TeacherScheduleDay, Period, TeacherSchedulePeriod } from "../data/Types.ts";

export let emptyTimeTableDetails: TimeTableType = [
    [["FirstTeacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"]],
    [["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"]],
    [["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"]],
    [["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"]],
    [["Teacher", "Lab", "roomCode"], ["Teacher", "Lab", "roomCode"], ["Teacher", "Lab", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"], ["Teacherlast", "Subject", "roomCode"], ["Teacher", "Subject", "roomCode"]]
]

interface TimeTableProps {
    noOfDays?: number,
    noOfPeriods?: number,
    breakTimeIndexs?: number[],

    dayNames?: string[],
    periodTimes?: string[],

    details?: TimeTableType | TeacherSchedule,
    subjectIndexAtPeriodElementInDetails?: number,
    subjectsDetails?: { [subjectName: string]: Subject },

    periodClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void,
    className?: string,
    timeTableWidthInPercent?: number
}

const TimeTable: React.FC<TimeTableProps> = ({
    noOfDays = 5,
    noOfPeriods = 9,
    breakTimeIndexs = [4],

    dayNames = ["Tue", "Wed", "Thu", "Fri", "Sat"],
    periodTimes = ["9:30AM", "10:20AM", "11:10AM", "12:00PM", "12:50PM", "01:40PM", "02:30PM", "03:20PM", "04:10PM"],

    details = emptyTimeTableDetails,

    subjectIndexAtPeriodElementInDetails = 1,
    subjectsDetails,

    periodClickHandler = () => { },

    className = "",
    timeTableWidthInPercent = 95,
}): JSX.Element => {
    if (details.length <= 0) return <></>

    const breakWord = "BREAK";
    let dayRows = [];
    if (details)
        if (dayNames.length === details.length && subjectsDetails) {
            for (let i = 0; i < details.length; i++) {
                dayRows.push(
                    <DaysRow
                        key={i}
                        details={details[i]}
                        breakWord={breakWord[i]}
                        subjectsDetails={subjectsDetails}
                        breakTimeIndexs={breakTimeIndexs}
                        subjectIndexAtPeriodElementInDetails={subjectIndexAtPeriodElementInDetails}
                        dayName={dayNames[i]}
                        periodClickHandler={periodClickHandler} />
                )
            }
        } else {
            dayRows.push(<div className="invalid-text" key={"error"}>Invalid Data</div>)
        }
    else dayRows.push(
        <div
            className="text"
            style={{ display: "grid", justifyContent: "center", alignItems: "center" }}
            key={"error"}>
            No Scedule Found <br />or <br />Time Table was not Generated Yet
        </div>
    )

    return (
        <div className={"time-table-container " + className}>
            <div className="period-times-container">
                <div className="column-row-identifier">
                    <span className="column-indentifier">Day\
                        <span className="row-indentifier">Time</span>
                    </span>
                </div>
                {periodTimes && periodTimes.length > 0 && periodTimes.map((time) => (
                    <div className="time" key={time}>{time}</div>
                ))}
            </div>
            {dayRows}
        </div>
    )
}

interface DaysRowProps {
    details: Day | TeacherScheduleDay,
    breakWord: string,
    subjectsDetails: { [subjectName: string]: Subject },
    breakTimeIndexs: number[]
    dayName: string,
    subjectIndexAtPeriodElementInDetails: number,
    periodClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const DaysRow: React.FC<DaysRowProps> = ({
    details,
    breakWord,
    subjectsDetails,
    breakTimeIndexs,
    dayName,
    subjectIndexAtPeriodElementInDetails,
    periodClickHandler = () => { }
}) => {
    let index = 0;
    let DayElements = [];
    if (!details) return <div className="day-container"></div>
    while (index < details.length) {
        let periodDetails: Period | TeacherSchedulePeriod = details[index]
        if (hasElement(breakTimeIndexs, index)) {
            DayElements.push(<div className="period-details-container break" onClick={periodClickHandler}>
                <div> </div>
                <div> {breakWord} </div>
                <div> </div>
            </div>)
        } else {
            if (periodDetails === null) {
                DayElements.push(<PeriodComp
                    key={index}
                    periodDetails={null}
                    index={index}
                    breakTimeIndexs={breakTimeIndexs}
                    breakWord={breakWord}
                    onClick={() => { }} />)
            } else if (periodDetails !== null && periodDetails && periodDetails[subjectIndexAtPeriodElementInDetails]) {
                DayElements.push(<PeriodComp
                    key={index}
                    periodDetails={periodDetails}
                    index={index}
                    breakTimeIndexs={breakTimeIndexs}
                    breakWord={breakWord}
                    isLab={subjectsDetails[periodDetails[subjectIndexAtPeriodElementInDetails]].isPractical}
                    onClick={periodClickHandler} />)
            } else DayElements.push(<PeriodComp
                key={index}
                periodDetails={periodDetails}
                index={index}
                breakTimeIndexs={breakTimeIndexs}
                breakWord={breakWord}
                onClick={periodClickHandler} />)
            index++
        }
    }
    return (
        <div className="day-container">
            <div className="day-name">{dayName}</div>
            {DayElements}
        </div>
    )
}

interface PeriodProps {
    periodDetails: Period | TeacherSchedulePeriod,
    index: number,
    breakTimeIndexs: number[],
    breakWord?: string,
    isLab?: boolean,
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const PeriodComp: React.FC<PeriodProps> = ({ periodDetails = [], index, breakTimeIndexs = [], breakWord, isLab = false, onClick = () => { } }) => {
    if (hasElement(breakTimeIndexs, index)) return (
        <div className="period-details-container break" onClick={onClick}>
            <div> </div>
            <div> {breakWord} </div>
            <div> </div>
        </div>
    )
    return (
        <div className="period-details-container" style={isLab ? { gridColumn: 'auto / span 3' } : {}} onClick={onClick}>
            {periodDetails && periodDetails.map((detail, index) => (
                <div key={index}>{detail}</div>
            ))}
        </div>
    )
}

export default memo(TimeTable)