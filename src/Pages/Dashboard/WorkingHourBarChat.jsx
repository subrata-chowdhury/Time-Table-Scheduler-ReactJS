import { memo } from "react";
import "../../Style/WorkingHourBarChat.css";

const WorkingHourBarChat = ({
    dayNames = ["Tue", "Wed", "Thu", "Fri", "Sat"],
    perDayValue = [5, 0, 8, 1, 2],
    maxValue = 8
}) => {
    let bars = [];
    if (dayNames.length !== perDayValue.length)
        bars.push(<div className="invaild-text">Invaild Input</div>);
    else {
        for (let index = 0; index < perDayValue.length; index++) {
            bars.push(
                <div className="bar-container" key={index}>
                    <Bar value={perDayValue[index]} maxValue={maxValue} />
                    <div className="bar-title">{dayNames[index]}</div>
                </div>
            );
        }
    }

    return (
        <div className="working-hour-barchat-container-wrapper">
            <div className="title">Class Taken Per Day</div>
            <div className="working-hour-barchat-container">
                {bars}
            </div>
        </div>
    );
};

const Bar = ({ value = 0, maxValue = 8 }) => {
    return (
        <div className="bar" title={value.toString()}>
            <div className="inner-bar" style={{ height: (value / maxValue) * 100 + "%" }}></div>
        </div>
    );
};

export default memo(WorkingHourBarChat);
