import "../Style/TimeTable.css"
let subDetail = [{
    sub: "Subject",
    isLab: false
}, { sub: "Lab", isLab: true }]
export default function TimeTable({
    noOfDays = 5,
    noOfPeriods = 8,
    breakTimeIndexs = [4],
    dayNames = ["Tue", "Wed", "Thu", "Fri", "Sat"],
    periodTimes = ["9:30AM", "10:20AM", "11:10AM", "12:00PM", "12:50PM", "01:40PM", "02:30PM", "03:20PM", "04:10PM"],
    details = [
        [["FirstSir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
        [["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
        [["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
        [["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"]],
        [["Sir", "Lab", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sir", "Subject", "roomCode"], ["Sirlast", "Subject", "roomCode"]]
    ],
    className = "",
    timeTableWidthInPercent = 95,
}) {
    let periodTimesRow = [];
    periodTimes.forEach((e) => {
        periodTimesRow.push(<div className="time" key={e}>{e}</div>);
    })

    let breakWord = "BREAK";
    let dayRows = [];
    let gridCss = "";
    let gridWidth = timeTableWidthInPercent / (noOfPeriods + breakTimeIndexs.length + 1)
    for (let i = 0; i < (noOfPeriods + breakTimeIndexs.length) + 1; i++) {
        gridCss += gridWidth + "%";
    }
    if (details.length !== 0)
        if (dayNames.length === details.length) {
            for (let index = 0; index < dayNames.length; index++) {
                dayRows.push(<div className="day-container" style={{ gridTemplateColumns: gridCss }} key={index}>{createASingleDayRow(dayNames[index], details[index], breakWord[index])}</div>)
            }
        } else {
            dayRows.push(<div className="invalid-text" key={"error"}>Invalid Inputs</div>)
        }
    else dayRows.push(<div className="text" key={"error"}>No Scedule Found <br />or <br />Time Table was not Generated Yet</div>)

    function createASingleDayRow(dayName = "", listOfDetailsOfThatDay = [], breakWord) {
        let dayRow = [];
        dayRow.push(<div className="day-name" key={0}>{dayName}</div>)
        let totalNoOfPeriods = noOfPeriods + breakTimeIndexs.length;
        let indexForArray = 0;
        let outerIndex = 1;
        while (outerIndex <= totalNoOfPeriods) {
            if (breakTimeIndexs.indexOf(outerIndex - 1) >= 0) {
                dayRow.push(
                    <div className="period-details-container break" key={outerIndex}>
                        <div> </div>
                        <div> {breakWord} </div>
                        <div> </div>
                    </div>
                )
                outerIndex++;
            } else {
                let periodDetails = [];
                let lab;
                for (let index = 0; index < subDetail.length; index++) {
                    if (subDetail[index].sub === listOfDetailsOfThatDay[indexForArray][1]) {
                        lab = subDetail[index].isLab;
                        console.log(subDetail[index].sub + "===" + listOfDetailsOfThatDay[indexForArray][1] + "=" + lab)
                        break;
                    }
                }
                for (let index = 0; index < listOfDetailsOfThatDay[indexForArray].length; index++) {
                    periodDetails.push(<div key={listOfDetailsOfThatDay[indexForArray][index]}>{listOfDetailsOfThatDay[indexForArray][index]}</div>)
                }
                let spanCss = {};
                if (lab === true) {
                    spanCss = { gridColumn: 'auto / span 3' };
                    outerIndex += 3
                } else {
                    outerIndex++
                }
                dayRow.push(
                    <div className="period-details-container class" key={outerIndex} style={spanCss}>
                        {periodDetails}
                    </div>
                )
                indexForArray++;
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