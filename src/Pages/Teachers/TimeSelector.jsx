import { memo, useEffect, useState } from "react";
import { getTimeTableStructure } from "../../Script/TimeTableDataFetcher";
import { hasElement } from "../../Script/util";
const TimeSelector = memo(({ onChange = () => { }, selectedValues = [] }) => {
    const [periodCount, setPeriodCount] = useState(8);
    useEffect(() => {
        getTimeTableStructure((timeTableStructure) => { setPeriodCount(timeTableStructure.periodCount); }); // api call
    }, []);
    let noOfDays = 5;
    let timeTable = [];
    for (let day = 0; day < noOfDays; day++) {
        let selectedValuesOfThatDay = [];
        for (let index = 0; index < selectedValues.length; index++) {
            if (selectedValues[index][0] === (day + 1))
                selectedValuesOfThatDay.push(selectedValues[index][1]);
        }
        timeTable.push(<Periods key={day} day={day} noOfPeriods={periodCount} activeIndexs={selectedValuesOfThatDay} onClick={onChange}></Periods>);
    }
    return (<div className='time-selector'>
        <div className='time-table-container'>
            {timeTable}
        </div>
    </div>);
});
const Periods = memo(({ noOfPeriods, day, onClick = () => { }, activeIndexs = [] }) => {
    let periods = [];
    for (let period = 0; period < noOfPeriods; period++) {
        const active = hasElement(activeIndexs, (period + 1));
        periods.push(<div key={period} className={'period' + (active ? " selected" : "")} onClick={() => {
            onClick([day + 1, period + 1], active);
        }}>
            {period + 1}
        </div>);
    }
    return (<div className='periods-container'>
        {periods}
    </div>);
});
export default TimeSelector;
