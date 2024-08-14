import MiniStateContainer from '../Components/MiniStateContainer';
import Menubar from '../Components/Menubar';
import Cards from '../Components/Cards';
import "../Style/Teachers.css";
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import SearchBar from '../Components/SearchBar';
import { deleteTeacher, getTeacher, getTeachersList, saveTeacher } from '../Script/TeachersDataFetcher';
import { getTimeTableStructure } from '../Script/TimeTableDataFetcher';
import { getSubjectsList } from '../Script/SubjectsDataFetcher';
import "../Script/commonJS";
import { hasElement } from '../Script/util';
import TagInput from '../Components/TagInput';
import OwnerFooter from '../Components/OwnerFooter';
import Loader from '../Components/Loader';
import { verifyTeacherInputs } from '../Script/InputVerifiers/TeacherFormVerifier';
function TeachersPage() {
    return (<>
            <Menubar activeMenuIndex={1}/>
            <div className='main-container teachers'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>);
}
function MainComponents() {
    const [teachersList, setTeahersList] = useState([]);
    const [teacherName, setTeacherName] = useState("");
    const [displayLoader, setDisplayLoader] = useState(false);
    const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    useEffect(() => {
        startUpFunction();
    }, []);
    const startUpFunction = useCallback(() => {
        getTeachersList(setTeahersList); // api call
        setTeacherName("");
        setDisplayLoader(false);
        try {
            let paramString = window.location.href.split('?')[1];
            let queryString = new URLSearchParams(paramString);
            let urlData = ["", ""];
            for (let pair of queryString.entries()) {
                urlData = [pair[0], pair[1].split("#")[0]];
                break;
            }
            if (urlData[0] === "click") {
                let clicked = false;
                let loop = 0;
                let interval = setInterval(() => {
                    const cardsContainer = document.querySelector(".cards-container");
                    let card = cardsContainer?.querySelector(".card.data[title=" + urlData[1] + "]");
                    if (!clicked) {
                        try {
                            if (card !== undefined && card !== null) {
                                card.click();
                                clicked = true;
                            }
                        }
                        catch (err) {
                            clicked = false;
                        }
                    }
                    else {
                        clearInterval(interval);
                    }
                    if (loop++ == 50) {
                        clearInterval(interval);
                    }
                }, 100);
            }
        }
        catch (err) {
            console.log("%cNo Click Query Found", "color: green");
        }
    }, []);
    return (<>
            <div className='top-sub-container'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer onChange={startUpFunction}/>
                        <SearchBar array={teachersList} onChange={setFilteredTeacherList}/>
                    </div>
                    <Cards cardList={filteredTeacherList} cardClassName={"teacher-card"} onCardClick={name => setTeacherName(name)} onAddBtnClick={() => {
            setTeacherName("");
        }}/>
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer activeTeacherName={teacherName} teachersList={teachersList} onSubmitCallBack={startUpFunction} setDisplayLoader={setDisplayLoader}/>
                </div>
            </div>
            {displayLoader && <Loader />}
        </>);
}
const DetailsContainer = ({ activeTeacherName = "", teachersList, onSubmitCallBack, setDisplayLoader }) => {
    const [teacherName, setTeacherName] = useState(activeTeacherName);
    const [teacherDetails, setTeacherDetails] = useState({
        freeTime: [],
        subjects: [],
    });
    const [disabled, setDisabled] = useState(false);
    const [inEditState, setInEditState] = useState(false);
    const subjectList = useRef();
    useEffect(() => {
        setTeacherName(activeTeacherName);
        if (activeTeacherName === "") {
            setTeacherDetails({ freeTime: [], subjects: [] });
            setInEditState(false);
        }
        else {
            getTeacher(activeTeacherName, setTeacherDetails); // api call
            setInEditState(true);
        }
        ;
    }, [activeTeacherName]);
    useEffect(() => {
        getSubjectsList(data => subjectList.current = data); // api call
    }, []);
    const updateTeacherFreeTimeDetails = useCallback((time, active) => {
        let newDetails = { ...teacherDetails };
        if (active) {
            let found = -1;
            for (let index = 0; index < newDetails.freeTime.length; index++) {
                if (newDetails.freeTime[index][0] === time[0] && newDetails.freeTime[index][1] === time[1]) {
                    found = index;
                    break;
                }
            }
            newDetails.freeTime.splice(found, 1);
        }
        else {
            newDetails.freeTime[newDetails.freeTime.length] = time;
        }
        setTeacherDetails(newDetails);
    }, [teacherDetails]);
    const inputOnChangeHandler = useCallback((event) => {
        if (event.target.name === 'teacherName')
            setTeacherName(event.target.value.toUpperCase());
        else
            setTeacherDetails(value => ({ ...value, [event.target.name]: event.target.value }));
    }, []);
    const checkIfAlreadyExist = useCallback((teacherName) => {
        if (hasElement(teachersList, teacherName))
            setInEditState(true); // if teacher exist show delete btn
        else
            setInEditState(false); // if not teacher exist show delete btn
    }, [teachersList]);
    const teacherFormSubmitHandler = useCallback((event) => {
        event.preventDefault();
        //verification of inputs
        let verifiedData = verifyTeacherInputs(teacherName, teacherDetails, subjectList);
        if (verifiedData)
            if (hasElement(teachersList, verifiedData.newTeacherName)) { // checking if the teacher exsist or not
                if (window.confirm("Are you want to overwrite " + teacherName)) // if exist show a confirmation box
                    saveData(verifiedData.newTeacherName, verifiedData.teacherData); // if yes then save else do nothing
            }
            else
                saveData(verifiedData.newTeacherName, verifiedData.teacherData);
    }, [teacherName, teacherDetails, teachersList]);
    const saveData = useCallback((teacherName, teacherData) => {
        setDisplayLoader(true);
        setDisabled(true);
        saveTeacher(teacherName, teacherData, () => {
            alert(JSON.stringify({ teacherName, teacherData }) + "---------- is added");
            onSubmitCallBack(); // referenced to start up function
        }).then(() => {
            setDisplayLoader(false);
            setDisabled(false);
        }).catch(() => {
            setDisplayLoader(false);
            setDisabled(false);
        });
    }, []);
    const deleteTeacherBtnClickHandler = useCallback((event) => {
        event.preventDefault();
        if (hasElement(teachersList, teacherName)) // checking if the teacher exsist or not
            if (window.confirm("Are you sure? Want to Delete " + teacherName + " ?")) { // if exist show a confirmation box
                deleteTeacher(teacherName, () => {
                    onSubmitCallBack(); // referenced to start up function
                }, () => {
                    setDisplayLoader(false); // if failed only hide loader
                });
            }
    }, [teacherName]);
    return (<form className='details-container' onSubmit={teacherFormSubmitHandler}>
            <div className='inputs-container-heading'>Details</div>
            <div className="input-container">
                <div className="input-box-heading">Teacher Name</div>
                <input type="text" className="input-box" name='teacherName' value={teacherName} placeholder='Ex. ABC' onChange={event => {
            checkIfAlreadyExist(event.target.value.toUpperCase());
            inputOnChangeHandler(event);
        }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Names</div>
                {subjectList.current && <TagInput validTags={subjectList.current} tagList={teacherDetails.subjects} onChange={(data) => {
                let newTeacherDetails = { ...teacherDetails, subject: data };
                setTeacherDetails(newTeacherDetails);
            }}/>}
            </div>
            <div className='input-container'>
                <div>Available Times</div>
                <TimeSelector onChange={updateTeacherFreeTimeDetails} selectedValues={teacherDetails.freeTime}/>
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn' type='submit' disabled={disabled}>Save</button>
                {inEditState && <button className='teacher-delete-btn' onClick={deleteTeacherBtnClickHandler}>Delete</button>}
            </div>
        </form>);
};
const TimeSelector = memo(({ onChange = () => { }, selectedValues = [] }) => {
    const [periodCount, setPeriodCount] = useState(8);
    useEffect(() => {
        getTimeTableStructure((timeTableStructure) => { setPeriodCount(timeTableStructure.periodCount); }); // api call
    }, []);
    let noOfDays = 5;
    let timeTable = [];
    for (let day = 0; day < noOfDays; day++) {
        let selectedValuesOfThatDay = [];
        for (let index = 0; index < selectedValues.length; index++) {
            if (selectedValues[index][0] === (day + 1))
                selectedValuesOfThatDay.push(selectedValues[index][1]);
        }
        timeTable.push(<Periods key={day} day={day} noOfPeriods={periodCount} activeIndexs={selectedValuesOfThatDay} onClick={onChange}></Periods>);
    }
    return (<div className='time-selector'>
            <div className='time-table-container'>
                {timeTable}
            </div>
        </div>);
});
const Periods = memo(({ noOfPeriods, day, onClick = () => { }, activeIndexs = [] }) => {
    let periods = [];
    for (let period = 0; period < noOfPeriods; period++) {
        const active = hasElement(activeIndexs, (period + 1));
        periods.push(<div key={period} className={'period' + (active ? " selected" : "")} onClick={() => {
                onClick([day + 1, period + 1], active);
            }}>
                {period + 1}
            </div>);
    }
    return (<div className='periods-container'>
            {periods}
        </div>);
});
export default memo(TeachersPage);
