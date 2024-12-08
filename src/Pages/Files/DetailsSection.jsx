import { memo, useCallback, useEffect, useState } from "react";
import { hasElement } from "../../Script/util";
import { createNewFile, deleteFile, saveCurrentState } from "../../Script/FilesDataFetchers";
import { useAlert } from "../../Components/AlertContextProvider";
import { useConfirm } from "../../Components/ConfirmContextProvider";

const DetailsContainer = ({
    active = false,
    activeFileName = "",
    files,
    startUp,
    onClose = () => { }
}) => {
    const [fileName, setFileName] = useState(activeFileName);
    const [inEditState, setInEditState] = useState(false);

    const { showWarning, showSuccess, showError } = useAlert();
    const { showWarningConfirm } = useConfirm();

    useEffect(() => {
        setFileName(activeFileName);
        if (activeFileName === "")
            setInEditState(false);
        else
            setInEditState(true);
    }, [activeFileName]);

    const fileFormOnSubmitHandler = useCallback((event) => {
        event.preventDefault();
        const file = fileName.trim().toUpperCase();
        if (file === "") {
            showWarning("File Name can't be Empty");
            return;
        }
        if (hasElement(files, file)) {
            saveCurrentState(file, () => {
                startUp();
                showSuccess(`Current State is Saved in ${file.toUpperCase()}`);
            }, showError); // api call
        }
        else {
            showWarningConfirm("Are you want to save the current state into " + file + "?", () => saveCurrentState(file, () => {
                startUp();
                showSuccess(`Current State is Saved in ${file.toUpperCase()}`);
            }, showError) // api call
            );
        }
    }, [fileName, files]);

    const createNewBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        //verifing data
        const file = fileName.trim().toUpperCase();
        if (file === "") {
            showWarning("File Name can't be Empty");
            return;
        }
        if (hasElement(files, file)) {
            showWarning("File already exist with same name");
            return;
        }
        else {
            createNewFile(file, () => {
                startUp();
            }, showSuccess); // api call
        }
    }, [fileName, files]);

    const deleteFileBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        if (hasElement(files, fileName)) // checking if the file exsist or not
            showWarningConfirm("Are you want to delete " + fileName + "?", // if exist show a confirmation box
                () => {
                    deleteFile(fileName, () => {
                        startUp();
                    }, () => showError("Someting went Wrong!"));
                });
    }, [files, fileName]);

    const checkIfAlreadyExist = useCallback((fileName) => {
        if (hasElement(files, fileName))
            setInEditState(true);
        else
            setInEditState(false);
    }, [files, fileName]);

    return (
        <form className={'details-container' + (active ? " active" : "")} onSubmit={fileFormOnSubmitHandler}>
            <div className='inputs-container-heading'>Details</div>
            <div className="input-container">
                <div className="input-box-heading">File Name</div>
                <input type="text" className="input-box" name='fileName' value={fileName} placeholder='Ex. ABC' onChange={event => {
                    checkIfAlreadyExist(event.target.value.toUpperCase());
                    setFileName(event.target.value.toUpperCase());
                }}></input>
            </div>
            <div className='save-btn-container'>
                <button className='file-save-btn' type='submit'>Copy Current State</button>
                {inEditState && <button className='file-delete-btn' onClick={deleteFileBtnClickHandler}>Delete</button>}
                {!inEditState && <button className='file-create-btn' onClick={createNewBtnClickHandler}>Create New</button>}
                <button className='file close-btn' onClick={e => {
                    e.preventDefault();
                    onClose();
                }}>Close</button>
            </div>
        </form>
    );
};

export default memo(DetailsContainer);
