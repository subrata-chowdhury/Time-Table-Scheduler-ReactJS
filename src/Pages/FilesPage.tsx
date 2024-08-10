import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import "../Style/Files.css"
import Cards from '../Components/Cards.tsx'
import { FormEvent, memo, useCallback, useEffect, useState } from 'react'
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
    const [files, setFiles] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>("")
    const [forceReRenderer, setForceReRenderer] = useState(false)

    useEffect(() => {
        startUp();
    }, [])

    const startUp = useCallback(() => {
        getSaveFileList(setFiles); // api call
        setFileName("");
    }, [])

    const fileCardClickHandler = useCallback((fileName: string) => {
        setFileName(fileName)
    }, [])
    const addFileBtnClickHandler = useCallback(() => {
        setFileName("")
    }, [])
    return (
        <div className='top-sub-container'>
            <div className='left-sub-container'>
                <div className='tools-container'>
                    <MiniStateContainer forceReRenderer={forceReRenderer} />
                    <SearchBar array={files} onChange={setFiles} />
                </div>
                <Cards
                    cardList={files}
                    cardClassName={"file-card"}
                    onCardClick={fileCardClickHandler}
                    onAddBtnClick={addFileBtnClickHandler}
                />
            </div>
            <div className='right-sub-container'>
                <DetailsContainer
                    activeFileName={fileName}
                    files={files}
                    startUp={startUp}
                    setForceReRenderer={setForceReRenderer}
                />
            </div>
        </div>
    )
}

interface DetailsContainerProps {
    activeFileName: string,
    files: string[],
    startUp: () => void,
    setForceReRenderer: React.Dispatch<React.SetStateAction<boolean>>
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({
    activeFileName = "",
    files,
    startUp,
    setForceReRenderer
}) => {
    const [fileName, setFileName] = useState<string>(activeFileName)

    const fileFormOnSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
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
    const createNewBtnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
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
    const deleteFileBtnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (hasElement(files, fileName)) // checking if the file exsist or not
            if (window.confirm("Are You Sure? Want to delete " + fileName + "?")) { // if exist show a confirmation box
                deleteFile(fileName, () => { // if yes then delete else do nothing  // api call
                    startUp();
                    setForceReRenderer(val => !val)
                })
            }
    }, [files, fileName])
    const checkIfAlreadyExist = useCallback((file: string) => {
        if (hasElement(files, file)) { }
        else { }
    }, [files])
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
                        setFileName(event.target.value.toUpperCase())
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

export default memo(FilesPage)