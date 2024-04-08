import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Files.css"
import Cards from '../Components/Cards'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { createNewFile, deleteFile, getSaveFileList, saveCurrentState } from '../Script/FilesDataFetchers'
import SearchBar from '../Components/SearchBar'
import "../Script/commonJS"
import OwnerFooter from '../Components/OwnerFooter'
import { hasElement } from '../Script/util'

function FilesPage() {
    return (
        <>
            <Menubar activeMenuIndex={5} />
            <div className='main-container files'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>
    )
}

function MainComponents() {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState("")
    const [forceReRenderer, setForceReRenderer] = useState(false)

    const hideDeleteBtnFunction = useRef(() => { })
    const showDeleteBtnFunction = useRef(() => { })

    useEffect(() => {
        startUp();
    }, [])

    const startUp = useCallback(() => {
        getSaveFileList(setFiles);
        setFileName("");
    }, [])

    const fileCardClickHandler = useCallback((event) => {
        setFileName(event.target.title)
        showDeleteBtnFunction.current()
    }, [])
    const addFileBtnClickHandler = useCallback(() => {
        hideDeleteBtnFunction.current()
        setFileName("")
    }, [])
    return (
        <div className='top-sub-container'>
            <div className='left-sub-container'>
                <div className='tools-container'>
                    <MiniStateContainer forceReRenderer={forceReRenderer} />
                    <SearchBar />
                </div>
                <Cards
                    cardDetails={files}
                    cardClassName={"file-card"}
                    cardClickHandler={fileCardClickHandler}
                    addBtnClickHandler={addFileBtnClickHandler}
                />
            </div>
            <div className='right-sub-container'>
                <DetailsContainer
                    fileName={fileName}
                    setFileName={setFileName}
                    files={files}
                    startUp={startUp}
                    showDeleteBtnFunction={showDeleteBtnFunction}
                    hideDeleteBtnFunction={hideDeleteBtnFunction}
                    setForceReRenderer={setForceReRenderer}
                />
            </div>
        </div>
    )
}

function DetailsContainer({ fileName, setFileName, files, startUp, showDeleteBtnFunction, hideDeleteBtnFunction, setForceReRenderer }) {

    const fileDeleteBtnRef = useRef()
    const fileCreateBtnRef = useRef()

    const inputOnChangeHandler = useCallback((event) => {
        setFileName(event.target.value.toUpperCase())
    }, [])
    const fileFormOnSubmitHandler = useCallback((event) => {
        event.preventDefault();
        const file = fileName.trim().toUpperCase()
        if (file === "") {
            alert("File Name can't be Empty");
            return;
        }
        if (hasElement(files, file)) {
            saveCurrentState(file, startUp);
        } else {
            if (window.confirm("Are you want to save the current state into " + file + "?"))
                saveCurrentState(file, startUp);
        }
    }, [fileName, files])
    const createNewBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        const file = fileName.trim().toUpperCase();
        if (file === "") {
            alert("File Name can't be Empty");
            return;
        }
        if (hasElement(files, file)) {
            alert("File already exist with same name")
            return
        } else {
            createNewFile(file, startUp);
            setForceReRenderer(val => !val)
        }
    }, [fileName, files])
    const deleteFileBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        if (hasElement(files, fileName))
            if (window.confirm("Are You Sure? Want to delete " + fileName + "?")) {
                deleteFile(fileName, () => {
                    startUp();
                    setForceReRenderer(val => !val)
                    hideDeleteBtnFunction.current()
                })
            }
    }, [files, fileName])
    const checkIfAlreadyExist = useCallback((file) => {
        if (hasElement(files, file)) showDeleteBtnFunction.current()
        else hideDeleteBtnFunction.current()
    }, [files])

    hideDeleteBtnFunction.current = useCallback(() => {
        fileDeleteBtnRef.current.style.cssText = "display: none;";
        fileCreateBtnRef.current.style.cssText = "display: block;";
    }, [])
    showDeleteBtnFunction.current = useCallback(() => {
        fileDeleteBtnRef.current.style.cssText = "display: block;";
        fileCreateBtnRef.current.style.cssText = "display: none;";
    }, [])
    return (
        <form className='details-container' onSubmit={fileFormOnSubmitHandler}>
            <div className='inputs-container-heading'>Details</div>
            <div className="input-container">
                <div className="input-box-heading">File Name</div>
                <input
                    type="text"
                    className="input-box"
                    name='fileName'
                    value={fileName}
                    placeholder='Ex. ABC'
                    onChange={event => {
                        checkIfAlreadyExist(event.target.value.trim().toUpperCase())
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className='save-btn-container'>
                <button className='file-save-btn' type='submit'>Copy Current State</button>
                <button className='file-delete-btn' onClick={deleteFileBtnClickHandler} ref={fileDeleteBtnRef}>Delete</button>
                <button className='file-create-btn' onClick={createNewBtnClickHandler} ref={fileCreateBtnRef}>Create New</button>
            </div>
        </form>
    )
}

export default memo(FilesPage)