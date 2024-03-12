import { useEffect, useRef, useState } from "react"
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers";
import "../Style/Mini-state-container.css";

export default function MiniStateContainer({ callBackAfterStateUpdate = () => { } }) {
    const [currentFileName, setCurrentFileName] = useState("");
    const [states, setStates] = useState([])
    const fileSelector = useRef()
    useEffect(() => {
        getSaveFileList(setStates);
    }, [])
    useEffect(() => {
        getCurrentFileName((data) => {
            setCurrentFileName(data)
        });
    }, [])
    useEffect(() => {
        let options = fileSelector.current.querySelectorAll("option");
        for (let index = 0; index < options.length; index++) {
            if (options[index].value === currentFileName.toLowerCase()) {
                options[index].selected = 'selected';
                break;
            }
        }
    }, [currentFileName, states])

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
            <label>Current File:</label>
            <select className="state-selector" onChange={event => { onChangeStateHandler(event) }} ref={fileSelector}>
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