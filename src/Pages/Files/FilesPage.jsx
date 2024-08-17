import MiniStateContainer from '../../Components/MiniStateContainer';
import "../../Style/Pages/Files.css";
import Cards from '../../Components/Cards';
import { memo, useCallback, useEffect, useState } from 'react';
import { getSaveFileList } from '../../Script/FilesDataFetchers';
import SearchBar from '../../Components/SearchBar';
import DetailsSection from './DetailsSection';

function FilesPage() {
    return (
        <>
            <div className='page files'>
                <MainComponents />
            </div>
        </>
    );
}

function MainComponents() {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [fileName, setFileName] = useState("");
    const [forceReRenderer, setForceReRenderer] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    useEffect(() => {
        startUp();
    }, []);

    const startUp = useCallback(() => {
        getSaveFileList(setFiles); // api call
        setFileName("");
    }, []);

    return (
        <div className='top-sub-container'>
            <div className='left-sub-container'>
                <div className='tools-container'>
                    <MiniStateContainer forceReRenderer={forceReRenderer} />
                    <SearchBar array={files} onChange={setFilteredFiles} />
                </div>
                <Cards cardList={filteredFiles} cardClassName={"file-card"} onCardClick={fileName => {
                    setFileName(fileName);
                    setShowDetailsPopup(true);
                }} onAddBtnClick={() => {
                    setFileName("");
                    setShowDetailsPopup(true);
                }} />
            </div>
            <DetailsSection
                active={showDetailsPopup}
                activeFileName={fileName}
                files={files}
                startUp={startUp}
                setForceReRenderer={setForceReRenderer}
                onClose={() => setShowDetailsPopup(false)} />
        </div>
    );
}

export default memo(FilesPage);
