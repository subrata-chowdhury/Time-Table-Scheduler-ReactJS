import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Files.css"
import Cards from '../Components/Cards'
import { useEffect, useState } from 'react'
import { deleteFile, getSaveFileList, saveCurrentState } from '../Script/FilesDataFetchers'
import { match } from '../Components/SearchBar'

function FilesPage() {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState("")
    useEffect(() => {
        startUp();
    }, [])

    function startUp() {
        getSaveFileList(setFiles);
        setFileName("");
    }

    function fileCardClickHandler(event) {
        setFileName(event.target.title)
        document.querySelector("form button.file-delete-btn").style.cssText = "display: block;";
    }
    function addFileBtnClickHandler() {
        document.querySelector("form button.file-delete-btn").style.cssText = "display: none;";
        setFileName("")
    }
    return (
        <>
            <Menubar activeMenuIndex={5} />
            <div className='main-container files'>
                <div className='left-sub-container'>
                    <MiniStateContainer />
                    <Cards
                        cardDetails={files}
                        cardClickHandler={fileCardClickHandler}
                        addBtnClickHandler={addFileBtnClickHandler} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        fileName={fileName}
                        setFileName={setFileName}
                        files={files}
                        startUp={startUp} />
                </div>
            </div>
        </>
    )
}

function DetailsContainer({ fileName, setFileName, files, startUp }) {
    function inputOnChangeHandler(event) {
        setFileName(event.target.value)
    }
    function fileFormOnSubmitHandler(event) {
        event.preventDefault();
        if (match(files, fileName).length > 0) {
            saveCurrentState(fileName, startUp);
        } else {
            if (window.confirm("Are you want to save the current state into " + fileName + "?"))
                saveCurrentState(fileName, startUp);
        }
    }
    function deleteFileBtnClickHandler(event) {
        event.preventDefault();
        if (window.confirm("Are You Sure? Want to delete " + fileName + "?")) {
            deleteFile(fileName, () => {
                startUp();
            })
        }
    }
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
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className='save-btn-container'>
                <button className='file-save-btn' type='submit'>Save</button>
                <button className='file-delete-btn' onClick={deleteFileBtnClickHandler}>Delete</button>
            </div>
        </form>
    )
}

export default FilesPage