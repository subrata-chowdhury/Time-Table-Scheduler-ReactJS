import MiniStateContainer from '../../Components/MiniStateContainer'
import SearchBar from '../../Components/SearchBar'
import Cards from '../../Components/Cards'
import "../../Style/Pages/Subjects.css"
import { useEffect, useState, memo, useCallback } from 'react'
import { getSubjectsList } from '../../Script/SubjectsDataFetcher'
import Loader from '../../Components/Loader'
import DetailsSection from './DetailsSection'

function SubjectsPage() {
    return (
        <>
            <div className='page subjects'>
                <MainComponents />
            </div>
        </>
    )
}

function MainComponents() {
    const [subjectsList, setSubjectsList] = useState<string[]>([])
    const [activeSubjectName, setActiveSubjectName] = useState<string>("")
    const [displayLoader, setDisplayLoader] = useState(false);
    const [filterdSubjectList, setFilterdSubjectList] = useState<string[]>(subjectsList)

    const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false)

    useEffect(() => {
        startUpFunction()
    }, [])

    const startUpFunction = useCallback(() => {
        getSubjectsList(setSubjectsList) // api call
        setDisplayLoader(false)
        setActiveSubjectName("")
    }, [])

    return (
        <>
            <div className='top-sub-container'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer onChange={startUpFunction} />
                        <SearchBar array={subjectsList} onChange={setFilterdSubjectList} />
                    </div>
                    <Cards
                        cardList={filterdSubjectList}
                        cardClassName={"subject-card"}
                        onCardClick={(name) => {
                            setActiveSubjectName(name)
                            setShowDetailsPopup(true)
                        }}
                        onAddBtnClick={() => {
                            setActiveSubjectName("")
                            setShowDetailsPopup(true)
                        }}
                    />
                </div>
                <DetailsSection
                    active={showDetailsPopup}
                    activeSubjectName={activeSubjectName}
                    subjectsList={subjectsList}
                    onSubmitCallBack={startUpFunction}
                    setDisplayLoader={setDisplayLoader}
                    onClose={() => setShowDetailsPopup(false)}
                />
            </div>
            {displayLoader && <Loader />}
        </>
    )
}

export default memo(SubjectsPage)