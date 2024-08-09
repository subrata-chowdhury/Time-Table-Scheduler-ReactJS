import { memo, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers.ts";
import "../Style/Mini-state-container.css";
import { checkCurrentStateIsSavedBeforeClose } from "../Script/commonJS.ts";

function MiniStateContainer({ callBackAfterStateUpdate = () => { }, forceReRenderer = false }) {
    const [states, setStates] = useState([])
    const fileSelector = useRef<any>()
    useEffect(() => {
        getSaveFileList((data) => { // api call
            setStates(data)
            getCurrentFileName((currentFileName) => { // api call
                let options = fileSelector.current? fileSelector.current.querySelectorAll("option"):"";
                for (let index = 0; index < options.length; index++) {
                    if (options[index].value === currentFileName.toLowerCase()) {
                        options[index].selected = 'selected';
                        break;
                    }
                }
            });
        });
    }, [forceReRenderer])

    const onChangeStateHandler = useCallback((event:any) => {
        checkCurrentStateIsSavedBeforeClose(changeTheState) // api calls present in the function
        function changeTheState() {
            loadSaveFile(event.target.value, callBackAfterStateUpdate); // api call
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

function Option({ value = "" }) {
    return (
        <option value={value.toLowerCase()}>{value}</option>
    )
}

export default memo(MiniStateContainer)