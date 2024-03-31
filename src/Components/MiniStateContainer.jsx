import { memo, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentFileIsSaved, getCurrentFileName, getSaveFileList, loadSaveFile, saveCurrentState } from "../Script/FilesDataFetchers";
import "../Style/Mini-state-container.css";

function MiniStateContainer({ callBackAfterStateUpdate = () => { } }) {
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

    const onChangeStateHandler = useCallback((event) => {
        getCurrentFileIsSaved((isSaved) => {
            if (!isSaved)
                if (window.confirm("You did't save the current state, Want to Save it now?")) {
                    getCurrentFileName((fileName) => {
                        saveCurrentState(fileName, changeTheState)
                    })
                } else changeTheState();
            else changeTheState();
        })
        function changeTheState() {
            setCurrentFileName(event.target.value)
            loadSaveFile(event.target.value, callBackAfterStateUpdate);
        }
    }, [])
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

export default memo(MiniStateContainer)