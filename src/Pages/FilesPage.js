import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Files.css"
import Cards from '../Components/Cards'
import { useEffect, useState } from 'react'
import { deleteFile, getSaveFileList, saveCurrentStateInNewFile } from '../Script/FilesDataFetchers'

function FilesPage() {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState("")
    useEffect(() => {
        getSaveFileList(setFiles);
    }, [])

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
                    <DetailsContainer fileName={fileName} setFileName={setFileName} />
                </div>
            </div>
        </>
    )
}

function DetailsContainer({ fileName, setFileName }) {
    function inputOnChangeHandler(event) {
        setFileName(event.target.value)
    }
    function fileFormOnSubmitHandler(event) {
        event.preventDefault();
        saveCurrentStateInNewFile(fileName)
    }
    function deleteFileBtnClickHandler(event) {
        event.preventDefault();
        if (window.confirm("Are You Sure? Want to delete " + fileName + "?")) {
            deleteFile(fileName, clearInputs)
            function clearInputs() {
                setFileName("")
            }
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