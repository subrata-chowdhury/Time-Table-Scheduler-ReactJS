import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import SearchBar from '../Components/SearchBar'
import Cards from '../Components/Cards'
import "../Style/Subjects.css"
import { useEffect, useState } from 'react'
import { deleteSubject, getSubjectDetails, getSubjectList } from '../Script/SubjectsDataFetcher'

function SubjectsPage() {
    const [subjectsList, setSubjectsList] = useState([])
    const [subjectDetails, setSubjectDetails] = useState({
        isPractical: false,
        lectureCount: 0,
        roomCodes: [],
        sem: ""
    })
    const [subjectName, setSubjectName] = useState()

    useEffect(() => {
        getSubjectList(setSubjectsList)
    }, [])

    function subjectCardOnClickHandler(event) {
        getSubjectDetails(event.target.title, setSubjectDetails)
        setSubjectName(event.target.title)
        document.querySelector('button.subject-delete-btn').style.cssText = "display: block";
    }
    function addSubjectCardClickHandler() {
        setSubjectDetails({
            isPractical: false,
            lectureCount: 0,
            roomCodes: [],
            sem: ""
        })
        setSubjectName("")
        document.querySelector("form button.subject-delete-btn").style.cssText = "display: none;";
    }
    return (
        <>
            <Menubar activeMenuIndex={0} />
            <div className='main-container subjects'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer />
                        <SearchBar />
                    </div>
                    <Cards cardDetails={subjectsList} cardClassName={"subject-card"} cardClickHandler={subjectCardOnClickHandler} addBtnClickHandler={addSubjectCardClickHandler} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        subjectName={subjectName}
                        subjectDetails={subjectDetails}
                        setSubjectDetails={setSubjectDetails}
                        setSubjectName={setSubjectName}
                    />
                </div>
            </div>
        </>
    )
}

function DetailsContainer({
    subjectName = "",
    subjectDetails,
    setSubjectDetails,
    setSubjectName
}) {
    function subjectTypeClickHandler(event) {
        let checkbox = event.target;
        let isLab = false;
        if (hasElement(event.target.classList, "active")) {
            checkbox.classList.remove("active");
            isLab = false;
        } else {
            checkbox.classList.add("active");
            isLab = true;
        }
        setSubjectDetails(value => ({ ...value, isPractical: isLab }))
    }
    function inputOnChangeHandler(event) {
        if (event.target.name === 'subjectName') setSubjectName(event.target.value)
        else setSubjectDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }
    function subjectFormSubmitHandler(event) {
        event.preventDefault();
        alert(JSON.stringify(subjectDetails))
    }
    function deleteSubjectBtnClickHandler() {
        if (window.confirm("Are You Sure? Want to Delete " + subjectName + " ?"))
            deleteSubject(subjectName, clearInputs)
        function clearInputs() {
            setSubjectDetails({
                isPractical: false,
                lectureCount: 4,
                roomCodes: [],
                sem: ""
            })
            setSubjectName("")
        }
    }
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
                    min={0}
                    value={subjectDetails.lectureCount}
                    title={subjectDetails.lectureCount}
                    onChange={event => {
                        inputOnChangeHandler(event);
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Classroom</div>
                <input
                    type="text"
                    className="input-box"
                    name='roomCodes'
                    value={subjectDetails.roomCodes}
                    placeholder='Ex. ABC'
                    onChange={event => {
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Type (On if Sub. is Practical)</div>
                <div className={'box ' + (subjectDetails.isPractical ? "active" : "")} name="isPractical" onClick={subjectTypeClickHandler}>
                    <div className='dot'></div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='subject-save-btn' type='submit'>Save</button>
                <button className='subject-delete-btn' onClick={deleteSubjectBtnClickHandler}>Delete</button>
            </div>
        </form>
    )
}

function hasElement(array, find) {
    for (let index = 0; index < array.length; index++) {
        if (array[index] === find) return true
    }
    return false
}

export default SubjectsPage