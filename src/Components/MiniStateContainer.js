import { useEffect, useState } from "react"
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers";
import "../Style/Mini-state-container.css";

export default function MiniStateContainer({ callBackAfterStateUpdate = () => { } }) {
    const [currentFileName, setCurrentFileName] = useState("");
    const [states, setStates] = useState([])
    useEffect(() => {
        getSaveFileList(setStates);
    }, [])
    useEffect(() => {
        getCurrentFileName(setCurrentFileName);
    }, [])

    function onChangeStateHandler(event) {
        setCurrentFileName(event.target.value)
        loadSaveFile(event.target.value);
        callBackAfterStateUpdate();
    }
    let options = [];
    for (let index = 0; index < states.length; index++) {
        options.push(<Option value={states[index]} key={index}></Option>)
    }
    return (
        <div className="mini-states-container">
            <label>Current File: {currentFileName.toUpperCase()}</label><br></br>
            <label>Change File:</label>
            <select className="state-selector" onChange={event => { onChangeStateHandler(event) }} value={currentFileName}>
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