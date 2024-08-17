import { memo, useCallback, useEffect, useRef, useState } from "react";
import "../Style/Mini-state-container.css";
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers";
import { checkForSave } from "../Script/commonJS";

const MiniStateContainer = ({ onChange = () => { }, forceReRenderer = false }) => {
    const [files, setFiles] = useState([]);

    const selectInput = useRef(null);

    useEffect(() => {
        getSaveFileList(files => {
            setFiles(files);
            getCurrentFileName(currentFileName => {
                selectInput.current?.querySelectorAll("option").forEach((option) => {
                    if (option.value.toLowerCase() === currentFileName.toLowerCase()) {
                        option.selected = true;
                    }
                });
            });
        });
    }, [forceReRenderer]);

    const onChangeStateHandler = useCallback((event) => {
        checkForSave(() => {
            loadSaveFile(event.target.value, () => {
                onChange();
            }); // api call
        }); // api calls present in the function
    }, []);

    return (
        <div className="mini-states-container">
            <label>Current File:</label>
            <select className="state-selector" onChange={onChangeStateHandler} ref={selectInput}>
                {files && files.length > 0 && files.map((file, index) => (<Option value={file} key={index}></Option>))}
            </select>
        </div>
    );
};

const Option = ({ value }) => {
    return (<option value={value.toLowerCase()}>{value}</option>);
};

export default memo(MiniStateContainer);
