import MiniStateContainer from '../../Components/MiniStateContainer'
import "../../Style/Files.css"
import Cards from '../../Components/Cards'
import { memo, useCallback, useEffect, useState } from 'react'
import { getSaveFileList } from '../../Script/FilesDataFetchers'
import SearchBar from '../../Components/SearchBar'
import "../../Script/commonJS"
import DetailsSection from './DetailsSection'

function FilesPage() {
    return (
        <>
            <div className='page files'>
                <MainComponents />
            </div>
        </>
    )
}

function MainComponents() {
    const [files, setFiles] = useState<string[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>("")
    const [forceReRenderer, setForceReRenderer] = useState(false)

    const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false)

    useEffect(() => {
        startUp();
    }, [])

    const startUp = useCallback(() => {
        getSaveFileList(setFiles); // api call
        setFileName("");
    }, [])

    return (
        <div className='top-sub-container'>
            <div className='left-sub-container'>
                <div className='tools-container'>
                    <MiniStateContainer forceReRenderer={forceReRenderer} />
                    <SearchBar array={files} onChange={setFilteredFiles} />
                </div>
                <Cards
                    cardList={filteredFiles}
                    cardClassName={"file-card"}
                    onCardClick={fileName => {
                        setFileName(fileName)
                        setShowDetailsPopup(true)
                    }}
                    onAddBtnClick={() => {
                        setFileName("")
                        setShowDetailsPopup(true)
                    }}
                />
            </div>
            <div className='right-sub-container'>
                <DetailsSection
                    active={showDetailsPopup}
                    activeFileName={fileName}
                    files={files}
                    startUp={startUp}
                    setForceReRenderer={setForceReRenderer}
                    onClose={() => setShowDetailsPopup(false)}
                />
            </div>
        </div>
    )
}

export default memo(FilesPage)