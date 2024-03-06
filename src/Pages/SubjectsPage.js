import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import SearchBar from '../Components/SearchBar'
import Cards from '../Components/Cards'
import { InputBox } from '../Components/BasicComponents'
import "../Style/Subjects.css"
import { useEffect, useState } from 'react'
import { getSubjectList } from '../Script/SubjectsDataFetcher'

function SubjectsPage() {
    const [subjectsList, setSubjectsList] = useState([])
    useEffect(() => {
        getSubjectList(setSubjectsList);
    }, [])
    return (
        <>
            <Menubar activeMenuIndex={0} />
            <div className='main-container subjects'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer />
                        <SearchBar />
                    </div>
                    <Cards cardDetails={subjectsList} cardClassName={"subject-card"} />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer />
                </div>
            </div>
        </>
    )
}

function DetailsContainer() {
    const [lectureCount, setLectureCount] = useState(8);
    function lectureCountChangeHandler(event) {
        setLectureCount(event.target.value)
    }
    function subjectTypeClickHandler(event) {
        let checkbox = event.target;
        let checkboxInput = document.querySelector(".subject-type-input");
        if (hasElement(event.target.classList, "active")) {
            checkbox.classList.remove("active");
            checkboxInput.checked = false;
        } else {
            checkbox.classList.add("active");
            checkboxInput.checked = true;
        }
    }
    return (
        <div className='details-container'>
            <div className='inputs-container-heading'>Details</div>
            <InputBox inputHeading='Subject Name' placeholder='Ex.: ABC' />
            <InputBox inputHeading='Semester' placeholder="Ex. 8" />
            <div className="input-container">
                <div className="input-box-heading">Lecture Count per Week (Value: {lectureCount})</div>
                <input type="range" className="input-box" max={40} min={0} value={lectureCount} title={lectureCount} onChange={lectureCountChangeHandler}></input>
            </div>
            <InputBox inputHeading='Classroom' placeholder='Ex.: r1, r2' />
            <div className="input-container">
                <div className="input-box-heading">Subject Type (On if Sub. is Practical)</div>
                <input type='checkbox' className='subject-type-input' placeholder='Ex.: r1, r2' />
                <div className='box' onClick={subjectTypeClickHandler}>
                    <div className='dot'></div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='subject-save-btn'>Save</button>
            </div>
        </div>
    )
}

function hasElement(array, find) {
    for (let index = 0; index < array.length; index++) {
        if (array[index] === find) return true
    }
    return false
}

export default SubjectsPage