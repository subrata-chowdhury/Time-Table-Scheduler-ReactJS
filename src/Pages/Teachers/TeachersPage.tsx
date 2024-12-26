import MiniStateContainer from '../../Components/MiniStateContainer'
import Cards from '../../Components/Cards'
import "../../Style/Pages/Teachers.css"
import { memo, useCallback, useEffect, useState } from 'react'
import SearchBar from '../../Components/SearchBar'
import { getTeachersList } from '../../Script/TeachersDataFetcher'
import Loader from '../../Components/Loader'
import DetailsSection from './DetailsSection'

function TeachersPage() {
    return (
        <>
            <div className='page teachers'>
                <MainComponents />
            </div>
        </>
    )
}

function MainComponents() {
    const [teachersList, setTeahersList] = useState<string[]>([]);
    const [teacherName, setTeacherName] = useState<string>("");
    const [displayLoader, setDisplayLoader] = useState<boolean>(false);
    const [filteredTeacherList, setFilteredTeacherList] = useState<string[]>([])

    const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false)

    useEffect(() => {
        startUpFunction()
    }, [])

    const startUpFunction = useCallback(() => {
        getTeachersList(setTeahersList); // api call
        setTeacherName("");
        setDisplayLoader(false);
        try {
            let paramString = window.location.href.split('?')[1];
            let queryString = new URLSearchParams(paramString);
            let urlData: [string, string] = ["", ""];
            for (let pair of queryString.entries()) {
                urlData = [pair[0], pair[1].split("#")[0]];
                break;
            }
            if (urlData[0] === "click") {
                let clicked = false;
                let loop = 0
                let interval = setInterval(() => {
                    const cardsContainer = document.querySelector(".cards-container")
                    let card: HTMLDivElement | null | undefined = cardsContainer?.querySelector(".card.data[title=" + urlData[1] + "]")
                    if (!clicked) {
                        try {
                            if (card !== undefined && card !== null) {
                                card.click()
                                clicked = true
                            }
                        } catch (err) {
                            clicked = false
                        }
                    } else {
                        clearInterval(interval)
                    }
                    if (loop++ == 50) {
                        clearInterval(interval)
                    }
                }, 100) // looping for 5 seconds to wait for the cards data to be fetched
            }
        } catch (err) {
            console.log("%cNo Click Query Found", "color: green");
        }
    }, [])

    return (
        <>
            <div className='top-sub-container'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer onChange={startUpFunction} />
                        <SearchBar array={teachersList} onChange={setFilteredTeacherList} />
                    </div>
                    <Cards
                        cardList={filteredTeacherList}
                        cardClassName={"teacher-card"}
                        onCardClick={name => {
                            setTeacherName(name);
                            setShowDetailsPopup(true)
                        }}
                        onAddBtnClick={() => {
                            setTeacherName("");
                            setShowDetailsPopup(true)
                        }}
                    />
                </div>
                <DetailsSection
                    active={showDetailsPopup}
                    activeTeacherName={teacherName}
                    teachersList={teachersList}
                    onSubmitCallBack={startUpFunction}

                    setDisplayLoader={setDisplayLoader}
                    onClose={() => setShowDetailsPopup(false)}
                />
            </div>
            {displayLoader && <Loader />}
        </>
    )
}

export default memo(TeachersPage)