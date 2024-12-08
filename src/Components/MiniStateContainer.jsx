import { memo, useCallback, useEffect, useState } from "react";
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers";
import "../Style/Mini-state-container.css";
import { checkForSave } from "../Script/commonJS";
import { useAlert } from "./AlertContextProvider";
import { useConfirm } from "./ConfirmContextProvider";

const MiniStateContainer = ({ onChange = () => { }, forceReRenderer = false }) => {
    const [files, setFiles] = useState([]);
    const [currentFileName, setCurrentFileName] = useState("");
    const [showStateSelector, setShowStateSelector] = useState(false);

    const { showSuccess, showError } = useAlert();
    const { showWarningConfirm } = useConfirm();

    useEffect(() => {
        getCurrentFileName(setCurrentFileName); // api call
        getSaveFileList(files => {
            setFiles(files);
        });
    }, [forceReRenderer]);

    const onChangeStateHandler = useCallback((fileName) => {
        checkForSave(() => {
            loadSaveFile(fileName, () => {
                showSuccess("File Loaded Successfully");
                onChange();
                setCurrentFileName(fileName);
            }); // api call
        }, showWarningConfirm, showError); // api calls present in the function
    }, []);

    return (
        <div className="mini-states-container">
            <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                Current File:
                <div title={currentFileName} style={{ maxWidth: '220px', boxSizing: 'border-box', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginLeft: '0.6rem', cursor: 'pointer', background: '#fff', padding: '0.2rem 0.4rem', borderRadius: '0.2rem', border: '2px solid #0000001a' }} onClick={() => setShowStateSelector(val => !val)}>{currentFileName}</div>
            </label>
            {showStateSelector && <div className="state-selector">
                {files && currentFileName != "" && files.length > 0 && files.map((file, index) => (<div key={index} className={"state" + (file.toLowerCase() == currentFileName.toLowerCase() ? " active" : "")} onClick={(file.toLowerCase() != currentFileName.toLowerCase()) ? () => {
                    setShowStateSelector(false);
                    onChangeStateHandler(file);
                } : () => { }}>
                    {file}
                </div>))}
            </div>}
            {showStateSelector && <div style={{ position: 'fixed', width: '100%', height: '100%', left: 0, top: 0, zIndex: 9 }} onClick={() => setShowStateSelector(false)}></div>}
        </div>
    );
};

export default memo(MiniStateContainer);
