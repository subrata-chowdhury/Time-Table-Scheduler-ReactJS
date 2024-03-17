import "../Style/TimeTable.css"

export let emptyTimeTableDetails = [
    [["FirstSir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
    [["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
    [["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
    [["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
    [["Sir", "Lab", "roomCode"], ["Sir", "Lab", "roomCode"], ["Sir", "Lab", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sirlast", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]]
]

export default function TimeTable({
    noOfDays = 5,
    noOfPeriods = 9,
    breakTimeIndexs = [4],
    dayNames = ["Tue", "Wed", "Thu", "Fri", "Sat"],
    periodTimes = ["9:30AM", "10:20AM", "11:10AM", "12:00PM", "12:50PM", "01:40PM", "02:30PM", "03:20PM", "04:10PM"],
    details = emptyTimeTableDetails,
    subjectIndexAtPeriod = 1,
    subjectsDetails,
    className = "",
    timeTableWidthInPercent = 95,
    periodClickHandler = () => { }
}) {
    if (details.length <= 0) return
    let periodTimesRow = [];
    for (let index = 0; index < periodTimes.length; index++) {
        periodTimesRow.push(<div className="time" key={periodTimes[index]}>{periodTimes[index]}</div>);
    }

    let breakWord = "BREAK";
    let dayRows = [];
    let gridCss = "";
    let gridWidth = timeTableWidthInPercent / (noOfPeriods + 1)
    for (let i = 0; i < (noOfPeriods) + 1; i++) {
        gridCss += gridWidth + "%";
    }
    if (details.length !== 0)
        if (dayNames.length === details.length) {
            createDayRows(subjectsDetails)
        } else {
            dayRows.push(<div className="invalid-text" key={"error"}>Invalid Inputs</div>)
        }
    else dayRows.push(
        <div
            className="text"
            style={{ display: "grid", justifyContent: "center", alignItems: "center" }}
            key={"error"}>
            No Scedule Found <br />or <br />Time Table was not Generated Yet
        </div>
    )

    function createDayRows(subjectsDetails) {
        for (let index = 0; index < dayNames.length; index++) {
            dayRows.push(
                <div className="day-container" style={{ gridTemplateColumns: gridCss }} key={"day" + index}>
                    {createASingleDayRow(index, details[index], breakWord[index], subjectsDetails)}
                </div>
            )
        }
    }
    function createASingleDayRow(dayNameIndex = "", listOfDetailsOfThatDay = "", breakWord, subjectsDetails) {
        if (listOfDetailsOfThatDay === "") return
        let dayRow = [];
        dayRow.push(<div className="day-name" key={0}>{dayNames[dayNameIndex]}</div>)
        let totalNoOfPeriods = noOfPeriods;
        let index = 1
        while (index <= totalNoOfPeriods) {
            if (breakTimeIndexs.indexOf(index) !== -1) {
                dayRow.push(
                    <div
                        className="period-details-container break"
                        key={"class" + index}
                        data-day={dayNameIndex}
                        data-period={index - 1}
                        onClick={periodClickHandler}>
                        <div> </div>
                        <div> {breakWord} </div>
                        <div> </div>
                    </div>
                )
                index++
            } else {
                let periodDetails = [];
                let spanCss = {};
                let lab = false;
                if (listOfDetailsOfThatDay[index - 1] === null) {
                    index++;
                } else {
                    let subject = subjectsDetails[listOfDetailsOfThatDay[index - 1][subjectIndexAtPeriod]]
                    if (subject) lab = subject.isPractical
                    for (let detailsIndex = 0; detailsIndex < listOfDetailsOfThatDay[index - 1].length; detailsIndex++) {
                        periodDetails.push(
                            <div key={"data" + detailsIndex}>
                                {listOfDetailsOfThatDay[index - 1][detailsIndex]}
                            </div>
                        )
                    }
                    if (lab === true) {
                        spanCss = { gridColumn: 'auto / span 3' };
                        index += 3
                    } else {
                        index++
                    }
                }
                let classNameDetails = "period-details-container ";
                periodDetails.length !== 0 ? classNameDetails += "class" : classNameDetails += ""
                dayRow.push(
                    <div
                        className={classNameDetails}
                        key={dayNameIndex + index}
                        data-day={dayNameIndex}
                        data-period={lab ? index - 4 : index - 2}
                        style={spanCss}
                        onClick={periodClickHandler}>
                        {periodDetails}
                    </div>
                )
            }
        }
        return dayRow;
    }
    return (
        <div className={"time-table-container " + className}>
            <div className="period-times-container" style={{ gridTemplateColumns: gridCss }}>
                <div className="column-row-identifier">
                    <span className="column-indentifier">Day\
                        <span className="row-indentifier">Time</span>
                    </span>
                </div>
                {periodTimesRow}
            </div>
            {dayRows}
        </div>
    )
}