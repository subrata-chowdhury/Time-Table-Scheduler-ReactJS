import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import SearchBar from '../Components/SearchBar.tsx'
import Cards from '../Components/Cards.tsx'
import "../Style/Subjects.css"
import { useEffect, useState, memo, useCallback, FormEvent } from 'react'
import { deleteSubject, getSubject, getSubjectsList, saveSubject } from '../Script/SubjectsDataFetcher'
import "../Script/commonJS"
import { hasElement } from '../Script/util.ts'
import TagInput from '../Components/TagInput.tsx'
import OwnerFooter from '../Components/OwnerFooter.tsx'
import Loader from '../Components/Loader.tsx'
import { verifySubjectInputs } from '../Script/InputVerifiers/SubjectFormVerifier.ts'
import { Subject } from '../data/Types.ts'

function SubjectsPage() {
    return (
        <>
            <Menubar activeMenuIndex={0} />
            <div className='main-container subjects'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>
    )
}

function MainComponents() {
    const [subjectsList, setSubjectsList] = useState<string[]>([])
    const [activeSubjectName, setActiveSubjectName] = useState<string>("")
    const [activeSubjectDetails, setActiveSubjectDetails] = useState<Subject>()
    const [displayLoader, setDisplayLoader] = useState(false);
    const [filterdSubjectList, setFilterdSubjectList] = useState<string[]>(subjectsList)

    useEffect(() => {
        startUpFunction()
    }, [])
    const startUpFunction = useCallback(() => {
        getSubjectsList(setSubjectsList) // api call
        setDisplayLoader(false)
    }, [])
    return (
        <>
            <Loader display={displayLoader} />
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
                            getSubject(name, setActiveSubjectDetails) // api call
                        }}
                    />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        activeSubjectName={activeSubjectName}
                        activeSubjectDetails={activeSubjectDetails}
                        subjectsList={subjectsList}
                        onSubmitCallBack={startUpFunction}
                        setDisplayLoader={setDisplayLoader}
                    />
                </div>
            </div>
        </>
    )
}

interface DetailsContainerProps {
    activeSubjectName: string,
    activeSubjectDetails: Subject | undefined,
    subjectsList: string[],
    onSubmitCallBack: () => void,
    setDisplayLoader: (value: boolean) => void
}

type SubjectInput = {
    sem: number | string;
    lectureCount: number;
    isPractical: boolean;
    isFree: boolean;
    roomCodes: string[]
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({
    activeSubjectName = "",
    activeSubjectDetails = null,
    subjectsList,
    onSubmitCallBack,
    setDisplayLoader
}) => {
    const [subjectName, setSubjectName] = useState<string>(activeSubjectName)
    const [subjectDetails, setSubjectDetails] = useState<Subject | SubjectInput>(activeSubjectDetails ? activeSubjectDetails : {
        isPractical: false,
        lectureCount: 4,
        roomCodes: [],
        sem: "",
        isFree: false
    })

    const subjectTypeClickHandler = useCallback(() => {
        setSubjectDetails(value => ({ ...value, isPractical: !value["isPractical"] }))
    }, [])
    const isFreeClickHandler = useCallback(() => {
        setSubjectDetails(value => ({ ...value, isFree: !value["isFree"] }))
    }, [])

    const inputOnChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'subjectName') setSubjectName(event.target.value.toUpperCase())
        else setSubjectDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }, [])
    const checkIfAlreadyExist = useCallback((teacher: string) => {
        if (hasElement(subjectsList, teacher)) { } // if teacher exist show delete btn
        else { } // if not teacher exist show delete btn
    }, [subjectsList])
    const subjectFormSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let verifiedData = verifySubjectInputs(subjectName, subjectDetails)
        if (verifiedData)
            if (hasElement(subjectsList, verifiedData.newSubjectName)) {
                if (window.confirm("Are you want to overwrite " + verifiedData.newSubjectName))
                    saveData(verifiedData.newSubjectName, verifiedData.data);
            } else saveData(verifiedData.newSubjectName, verifiedData.data);
    }, [subjectName, subjectDetails, subjectsList])
    const saveData = useCallback((subjectName: string, subjectData: Subject) => {
        setDisplayLoader(true)
        saveSubject(subjectName, subjectData, () => { // api call
            alert(JSON.stringify({ subjectName: subjectData }) + "---------- is added");
            onSubmitCallBack();

            // reseting form fields
            setSubjectName("")
            setSubjectDetails({
                isPractical: false,
                lectureCount: 4,
                roomCodes: [],
                sem: "",
                isFree: false
            })
        }, () => {
            setDisplayLoader(false)
        })
    }, [])

    const deleteSubjectBtnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (hasElement(subjectsList, subjectName)) // checking if the subject exsist or not
            if (window.confirm("Are You Sure? Want to Delete " + subjectName + " ?")) // if exist show a confirmation box
                deleteSubject(subjectName, () => { // api call
                    onSubmitCallBack(); // referenced to start up function
                }, () => {
                    setDisplayLoader(false) // if failed only hide loader
                })
    }, [subjectName])
    return (
        <form className='details-container' onSubmit={subjectFormSubmitHandler}>
            <div className='inputs-container-heading'>Details</div>
            <div className="input-container">
                <div className="input-box-heading">Subject Name</div>
                <input
                    type="text"
                    className="input-box"
                    name='subjectName'
                    value={subjectName}
                    placeholder='Ex. ABC'
                    onChange={event => {
                        checkIfAlreadyExist(event.target.value.trim().toUpperCase())
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Semester</div>
                <input
                    type="number"
                    className="input-box"
                    name='sem'
                    value={subjectDetails.sem}
                    placeholder='Ex. 8'
                    onChange={inputOnChangeHandler}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Lecture Count per Week (Value: {subjectDetails.lectureCount})</div>
                <input
                    type="range"
                    className="input-box"
                    name='lectureCount'
                    max={40}
                    min={1}
                    value={subjectDetails.lectureCount}
                    title={subjectDetails.lectureCount.toString()}
                    onChange={inputOnChangeHandler}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Classroom</div>
                <TagInput
                    tagList={subjectDetails.roomCodes}
                    onChange={(data) => {
                        let newSubjectDetails = { ...subjectDetails, roomCodes: data }
                        setSubjectDetails(newSubjectDetails)
                    }}
                />
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Type</div>
                <div className={'box'} onClick={subjectTypeClickHandler}>
                    <div className={'option' + (!subjectDetails.isPractical ? " active" : "")}>Theory</div>
                    <div className={'option' + (subjectDetails.isPractical ? " active" : "")}>Practical</div>
                </div>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Should be Taken by<br /> Teacher or Not</div>
                <div className={'box'} onClick={isFreeClickHandler}>
                    <div className={'option' + (subjectDetails.isFree ? " active" : "")}>No</div>
                    <div className={'option' + (!subjectDetails.isFree ? " active" : "")}>Yes</div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='subject-save-btn' type='submit'>Save</button>
                <button className='subject-delete-btn' onClick={deleteSubjectBtnClickHandler}>Delete</button>
            </div>
        </form>
    )
}

export default memo(SubjectsPage)