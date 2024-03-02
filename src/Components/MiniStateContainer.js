import { useEffect, useState } from "react"
import { getCurrentFileName } from "../Script/FilesDataFetchers";
import "../Style/Mini-state-container.css";

export default function MiniStateContainer() {
    const [currentFileName, setCurrentFileName] = useState("An Error Occured");
    useEffect(() => {
        getCurrentFileName(setCurrentFileName);
    }, [currentFileName])

    function onChangeStateHandler(event) {
        alert(event.target.value)
    }

    let options = [];
    let states = ["UI Demo", "UI Demo 2", "UI Demo 3", "UI Demo 4"]
    for (let index = 0; index < states.length; index++) {
        options.push(<Option value={states[index]} key={index}></Option>)
    }
    let currentState;
    return (
        <div className="mini-states-container">
            <label>Current File:</label>
            <select className="state-selector" onChange={event => { onChangeStateHandler(event) }} value={currentState}>
                {options}
            </select>
        </div>
    )
}

function Option({ value }) {
    return (
        <option value={value.toLowerCase()}>{value}</option>
    )
}