import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Files.css"
import Cards from '../Components/Cards'
import { useEffect, useState } from 'react'
import { createNewFile, deleteFile, getSaveFileList, saveCurrentState } from '../Script/FilesDataFetchers'
import { match } from '../Components/SearchBar'
import "../Script/commonJS"
import OwnerFooter from '../Components/OwnerFooter'

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
        document.querySelector("form button.file-create-btn").style.cssText = "display: none;";
    }
    function addFileBtnClickHandler() {
        document.querySelector("form button.file-delete-btn").style.cssText = "display: none;";
        document.querySelector("form button.file-create-btn").style.cssText = "display: block;";
        setFileName("")
    }
    return (
        <>
            <Menubar activeMenuIndex={5} />
            <div className='main-container files'>
                <div className='top-sub-container'>
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
                <OwnerFooter />
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
        if (fileName.trim() === "") {
            alert("File Name can't be Empty");
            return;
        }
        if (match(files, fileName).length > 0) {
            saveCurrentState(fileName, startUp);
        } else {
            if (window.confirm("Are you want to save the current state into " + fileName + "?"))
                saveCurrentState(fileName, startUp);
        }
    }
    function createNewBtnClickHandler(event) {
        event.preventDefault();
        if (fileName.trim() === "") {
            alert("File Name can't be Empty");
            return;
        }
        if (match(files, fileName).length > 0) {
            alert("File already exist with same name")
            return
        } else {
            createNewFile(fileName, startUp);
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
                <button className='file-save-btn' type='submit'>Copy Current State</button>
                <button className='file-delete-btn' onClick={deleteFileBtnClickHandler}>Delete</button>
                <button className='file-create-btn' onClick={createNewBtnClickHandler}>Create New</button>
            </div>
        </form>
    )
}

export default FilesPage