import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import SearchBar from '../Components/SearchBar.tsx'
import Cards from '../Components/Cards.tsx'
import "../Style/Subjects.css"
import { useEffect, useState, useRef, memo, useCallback } from 'react'
import { deleteSubject, getSubjectDetails, getSubjectList, saveSubject } from '../Script/SubjectsDataFetcher'
import "../Script/commonJS"
import { hasElement } from '../Script/util.ts'
import TagInput from '../Components/TagInput.tsx'
import OwnerFooter from '../Components/OwnerFooter.tsx'
import Loader from '../Components/Loader.tsx'
import { verifySubjectInputs } from '../Script/InputVerifiers/SubjectFormVerifier.ts'

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
    const [subjectsList, setSubjectsList] = useState([])
    const [subjectName, setSubjectName] = useState()
    const [displayLoader, setDisplayLoader] = useState(false);

    const subjectDeleteBtn = useRef()

    useEffect(() => {
        startUpFunction()
    }, [])
    const startUpFunction = useCallback(() => {
        getSubjectList(setSubjectsList) // api call
        setSubjectName("")
        setDisplayLoader(false)
    }, [])
    const subjectCardOnClickHandler = useCallback((event) => {
        setSubjectName(event.target.title)
        subjectDeleteBtn.current.style.cssText = "display: block";
    }, [])
    const addSubjectCardClickHandler = useCallback(() => {
        setSubjectName("")
        subjectDeleteBtn.current.style.cssText = "display: none;";
    }, [])
    return (
        <>
            <Loader display={displayLoader} />
            <div className='top-sub-container'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer callBackAfterStateUpdate={startUpFunction} />
                        <SearchBar />
                    </div>
                    <Cards
                        cardDetails={subjectsList}
                        cardClassName={"subject-card"}
                        cardClickHandler={subjectCardOnClickHandler}
                        addBtnClickHandler={addSubjectCardClickHandler} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        outerSubjectName={subjectName}
                        subjectsList={subjectsList}
                        onSubmitCallBack={startUpFunction}

                        subjectDeleteBtnRef={subjectDeleteBtn}
                        setDisplayLoader={setDisplayLoader}
                    />
                </div>
            </div>
        </>
    )
}

function DetailsContainer({
    outerSubjectName = "",
    subjectsList,
    onSubmitCallBack,

    subjectDeleteBtnRef,
    setDisplayLoader
}) {
    const [subjectName, setSubjectName] = useState('')
    const [subjectDetails, setSubjectDetails] = useState({
        isPractical: false,
        lectureCount: 4,
        roomCodes: [],
        sem: "",
        isFree: false
    })
    useEffect(() => {
        if (!outerSubjectName) {
            setSubjectName("")
            setSubjectDetails({
                isPractical: false,
                lectureCount: 4,
                roomCodes: [],
                sem: "",
                isFree: false
            })
        } else {
            setSubjectName(outerSubjectName)
            getSubjectDetails(outerSubjectName, setSubjectDetails) // api call
        }
    }, [outerSubjectName])
    const subjectTypeClickHandler = useCallback((event) => {
        setSubjectDetails(value => ({ ...value, isPractical: !value["isPractical"] }))
    }, [])
    const isFreeClickHandler = useCallback((event) => {
        setSubjectDetails(value => ({ ...value, isFree: !value["isFree"] }))
    }, [])
    const inputOnChangeHandler = useCallback((event) => {
        if (event.target.name === 'subjectName') setSubjectName(event.target.value.toUpperCase())
        else setSubjectDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }, [subjectDetails])
    const checkIfAlreadyExist = useCallback((teacher) => {
        if (hasElement(subjectsList, teacher)) subjectDeleteBtnRef.current.style.cssText = "display: block;"; // if teacher exist show delete btn
        else subjectDeleteBtnRef.current.style.cssText = "display: none;"; // if not teacher exist show delete btn
    }, [subjectsList])
    const subjectFormSubmitHandler = useCallback((event) => {
        event.preventDefault();

        let verifiedData = verifySubjectInputs(subjectName, subjectDetails)
        if (verifiedData)
            if (hasElement(subjectsList, verifiedData.newSubjectName)) {
                if (window.confirm("Are you want to overwrite " + verifiedData.newSubjectName))
                    saveData(verifiedData.newSubjectName, verifiedData.data);
            } else saveData(verifiedData.newSubjectName, verifiedData.data);
    }, [subjectName, subjectDetails, subjectsList])
    const saveData = useCallback((subjectName, subjectData) => {
        setDisplayLoader(true)
        let newData = new Map();
        newData[subjectName] = subjectData;
        saveSubject(newData, () => { // api call
            alert(JSON.stringify(newData) + "---------- is added");
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

    const deleteSubjectBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        if (hasElement(subjectsList, subjectName)) // checking if the subject exsist or not
            if (window.confirm("Are You Sure? Want to Delete " + subjectName + " ?")) // if exist show a confirmation box
                deleteSubject(subjectName, () => { // api call
                    onSubmitCallBack(); // referenced to start up function
                    subjectDeleteBtnRef.current.style.cssText = "display: none;"; // hide delete btn
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
                    onChange={event => {
                        inputOnChangeHandler(event)
                    }}></input>
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
                    title={subjectDetails.lectureCount}
                    onChange={event => {
                        inputOnChangeHandler(event);
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Classroom</div>
                <TagInput
                    inputName={'roomCodes'}
                    details={subjectDetails}
                    updateWithNewValues={(data) => {
                        let newSubjectDetails = { ...subjectDetails }
                        newSubjectDetails.roomCodes = data;
                        setSubjectDetails(newSubjectDetails)
                    }}
                />
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Type</div>
                <div className={'box'} name="isPractical" onClick={subjectTypeClickHandler}>
                    <div className={'option' + (!subjectDetails.isPractical ? " active" : "")}>Theory</div>
                    <div className={'option' + (subjectDetails.isPractical ? " active" : "")}>Practical</div>
                </div>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Should be Taken by<br /> Teacher or Not</div>
                <div className={'box'} name="isFree" onClick={isFreeClickHandler}>
                    <div className={'option' + (subjectDetails.isFree ? " active" : "")}>No</div>
                    <div className={'option' + (!subjectDetails.isFree ? " active" : "")}>Yes</div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='subject-save-btn' type='submit'>Save</button>
                <button className='subject-delete-btn' onClick={deleteSubjectBtnClickHandler} ref={subjectDeleteBtnRef}>Delete</button>
            </div>
        </form>
    )
}

export default memo(SubjectsPage)