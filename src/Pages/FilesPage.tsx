import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import "../Style/Files.css"
import Cards from '../Components/Cards.tsx'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { createNewFile, deleteFile, getSaveFileList, saveCurrentState } from '../Script/FilesDataFetchers.tsx'
import SearchBar from '../Components/SearchBar.tsx'
import "../Script/commonJS"
import OwnerFooter from '../Components/OwnerFooter.tsx'
import { hasElement } from '../Script/util.ts'

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
        getSaveFileList(setFiles); // api call
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
            saveCurrentState(file, startUp); // api call
        } else {
            if (window.confirm("Are you want to save the current state into " + file + "?"))
                saveCurrentState(file, startUp); // api call
        }
    }, [fileName, files])
    const createNewBtnClickHandler = useCallback((event) => {
        event.preventDefault();

        //verifing data
        const file = fileName.trim().toUpperCase();
        if (file === "") {
            alert("File Name can't be Empty");
            return;
        }
        if (hasElement(files, file)) {
            alert("File already exist with same name")
            return
        } else {
            createNewFile(file, startUp); // api call
            setForceReRenderer(val => !val)
        }
    }, [fileName, files])
    const deleteFileBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        if (hasElement(files, fileName)) // checking if the file exsist or not
            if (window.confirm("Are You Sure? Want to delete " + fileName + "?")) { // if exist show a confirmation box
                deleteFile(fileName, () => { // if yes then delete else do nothing  // api call
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

    hideDeleteBtnFunction.current = useCallback(() => { // hide delete btn & hide create btn
        fileDeleteBtnRef.current.style.cssText = "display: none;";
        fileCreateBtnRef.current.style.cssText = "display: block;";
    }, [])
    showDeleteBtnFunction.current = useCallback(() => { // show delete btn & hide create btn
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