import MiniStateContainer from '../Components/MiniStateContainer.tsx'
import Menubar from '../Components/Menubar.tsx'
import Cards from '../Components/Cards.tsx'
import "../Style/Teachers.css"
import { FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import SearchBar from '../Components/SearchBar.tsx'
import { deleteTeacher, getTeachersList, saveTeacher } from '../Script/TeachersDataFetcher.tsx'
import { getTimeTableStructure } from '../Script/TimeTableDataFetcher.tsx'
import { getSubjectsList } from '../Script/SubjectsDataFetcher'
import "../Script/commonJS"
import { hasElement } from '../Script/util.ts'
import TagInput from '../Components/TagInput.tsx'
import OwnerFooter from '../Components/OwnerFooter.tsx'
import Loader from '../Components/Loader.tsx'
import { verifyTeacherInputs } from '../Script/InputVerifiers/TeacherFormVerifier.ts'
import { Teacher } from '../data/Types.ts'

function TeachersPage() {
    return (
        <>
            <Menubar activeMenuIndex={1} />
            <div className='main-container teachers'>
                <MainComponents />
                <OwnerFooter />
            </div>
        </>
    )
}

function MainComponents() {
    const [teachersList, setTeahersList] = useState<string[]>([]);
    const [teacherName, setTeacherName] = useState<string>("");
    const [displayLoader, setDisplayLoader] = useState<boolean>(false);

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
                let interval = setInterval(() => {
                    const cardsContainer = document.querySelector(".cards-container")
                    let card: HTMLDivElement | null | undefined = cardsContainer?.querySelector(".card.data[title=" + urlData[1] + "]")
                    if (!clicked) {
                        try {
                            (card !== undefined && card !== null) ? card.click() : ""
                            clicked = true
                        } catch (err) { }
                    } else {
                        clearInterval(interval)
                    }
                }, 500)
            }
        } catch (err) {
            console.log("%cNo Click Query Found", "color: green");
        }
    }, [])
    const teacherCardOnClickHandler = useCallback((teacherName: string) => {
        setTeacherName(teacherName);
    }, [])
    const addTeacherCardClickHandler = useCallback(() => {
        setTeacherName("")
    }, [])
    return (
        <>
            <Loader display={displayLoader} />
            <div className='top-sub-container'>
                <div className='left-sub-container'>
                    <div className='tools-container'>
                        <MiniStateContainer onChange={startUpFunction} />
                        <SearchBar array={teachersList} onChange={setTeahersList} />
                    </div>
                    <Cards
                        cardList={teachersList}
                        cardClassName={"teacher-card"}
                        onCardClick={teacherCardOnClickHandler}
                        onAddBtnClick={addTeacherCardClickHandler}
                    />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer
                        activeTeacherName={teacherName}
                        teachersList={teachersList}
                        onSubmitCallBack={startUpFunction}

                        setDisplayLoader={setDisplayLoader}
                    />
                </div>
            </div>
        </>
    )
}

interface DetailsContainerProps {
    activeTeacherName: string,
    teachersList: string[],
    onSubmitCallBack: () => void,

    setDisplayLoader: React.Dispatch<React.SetStateAction<boolean>>
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({
    activeTeacherName = "",
    teachersList,
    onSubmitCallBack,

    setDisplayLoader
}) => {
    const [teacherName, setTeacherName] = useState<string>(activeTeacherName);
    const [teacherDetails, setTeacherDetails] = useState<Teacher>({
        freeTime: [],
        subjects: [],
    })
    const subjectList = useRef<string[] | undefined>();

    useEffect(() => {
        getSubjectsList(data => subjectList.current = data) // api call
    }, [])
    const modifyTheValueOfInputBox = useCallback((time: string, isSelected: boolean) => {
        let newDetails: Teacher = { ...teacherDetails };
        let parsedTime: [number, number] = JSON.parse(time)
        if (isSelected) {
            let found = -1;
            for (let index = 0; index < newDetails.freeTime.length; index++) {
                if (newDetails.freeTime[index][0] === parsedTime[0] && newDetails.freeTime[index][1] === parsedTime[1]) {
                    found = index;
                    break
                }
            }
            newDetails.freeTime.splice(found, 1);
        } else {
            newDetails.freeTime[newDetails.freeTime.length] = parsedTime;
        }
        setTeacherDetails(newDetails)
    }, [teacherDetails])
    const inputOnChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'teacherName') setTeacherName(event.target.value.toUpperCase())
        else setTeacherDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }, [])
    const checkIfAlreadyExist = useCallback((teacher: string) => {
        if (hasElement(teachersList, teacher)) { } // if teacher exist show delete btn
        else { } // if not teacher exist show delete btn
    }, [teachersList])
    const teacherFormSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //verification of inputs
        let verifiedData = verifyTeacherInputs(teacherName, teacherDetails, subjectList)
        if (verifiedData)
            if (hasElement(teachersList, verifiedData.newTeacherName)) { // checking if the teacher exsist or not
                if (window.confirm("Are you want to overwrite " + teacherName)) // if exist show a confirmation box
                    saveData(verifiedData.newTeacherName, verifiedData.teacherData); // if yes then save else do nothing
            } else saveData(verifiedData.newTeacherName, verifiedData.teacherData);
    }, [teacherName, teacherDetails, teachersList])
    const saveData = useCallback((teacherName: string, teacherData: Teacher) => {
        setDisplayLoader(true)
        saveTeacher(teacherName, teacherData, () => { // api call
            alert(JSON.stringify({ teacherName: teacherData }) + "---------- is added")
            onSubmitCallBack(); // referenced to start up function

            // reseting form fields
            setTeacherName("");
            setTeacherDetails({
                freeTime: [],
                subjects: [],
            })
        }, () => {
            setDisplayLoader(false)
        })
    }, [])
    const deleteTeacherBtnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (hasElement(teachersList, teacherName)) // checking if the teacher exsist or not
            if (window.confirm("Are you sure? Want to Delete " + teacherName + " ?")) { // if exist show a confirmation box
                deleteTeacher(teacherName, () => { // api call
                    onSubmitCallBack();  // referenced to start up function
                }, () => {
                    setDisplayLoader(false) // if failed only hide loader
                });
            }
    }, [teacherName])
    return (
        <form className='details-container' onSubmit={teacherFormSubmitHandler}>
            <div className='inputs-container-heading'>Details</div>
            <div className="input-container">
                <div className="input-box-heading">Teacher Name</div>
                <input
                    type="text"
                    className="input-box"
                    name='teacherName'
                    value={teacherName}
                    placeholder='Ex. ABC'
                    onChange={event => {
                        checkIfAlreadyExist(event.target.value.trim().toUpperCase())
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Names</div>
                {subjectList.current && <TagInput
                    validTags={subjectList.current}
                    tagList={teacherDetails.subjects}
                    onChange={(data) => {
                        let newTeacherDetails = { ...teacherDetails, subject: data }
                        setTeacherDetails(newTeacherDetails)
                    }}
                />}
            </div>
            <div className='input-container'>
                <div>Available Times</div>
                <TimeSelector
                    modifyTheValueOfInputBox={modifyTheValueOfInputBox}
                    teacherDetails={teacherDetails} />
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn' type='submit'>Save</button>
                <button className='teacher-delete-btn' onClick={deleteTeacherBtnClickHandler}>Delete</button>
            </div>
        </form>
    )
}

interface TimeSelectorProps {
    modifyTheValueOfInputBox: (time: string, isSelected: boolean) => void,
    teacherDetails: Teacher
}

const TimeSelector: React.FC<TimeSelectorProps> = memo(({ modifyTheValueOfInputBox, teacherDetails }) => {
    const [periodCount, setPeriodCount] = useState<number>(8);
    useEffect(() => {
        getTimeTableStructure((timeTableStructure) => { setPeriodCount(timeTableStructure.periodCount) }); // api call
    }, [])
    let noOfDays = 5;
    let timeTable = [];
    let newTeacherDetailsFreeTime = teacherDetails.freeTime
    for (let day = 0; day < noOfDays; day++) {
        let teacherDetailsFreeTimeOfThatDay = [];
        for (let index = 0; index < newTeacherDetailsFreeTime.length; index++) {
            if (newTeacherDetailsFreeTime[index][0] === (day + 1))
                teacherDetailsFreeTimeOfThatDay.push(newTeacherDetailsFreeTime[index][1])
        }
        timeTable.push(
            <Periods
                noOfPeriods={periodCount}
                day={day}
                modifyTheValueOfInputBox={modifyTheValueOfInputBox}
                key={day}
                teacherDetailsFreeTimeOfThatDay={teacherDetailsFreeTimeOfThatDay}
            ></Periods>
        )
    }
    return (
        <div className='time-selector'>
            <div className='time-table-container'>
                {timeTable}
            </div>
        </div>
    )
})

interface PeriodsProps {
    noOfPeriods: number,
    day: number,
    modifyTheValueOfInputBox: (time: string, isSelected: boolean) => void,
    teacherDetailsFreeTimeOfThatDay: number[]
}

const Periods: React.FC<PeriodsProps> = memo(({ noOfPeriods, day, modifyTheValueOfInputBox, teacherDetailsFreeTimeOfThatDay }) => {
    const [selected, setSelected] = useState(false)
    let periods = []
    for (let period = 0; period < noOfPeriods; period++) {
        if (hasElement(teacherDetailsFreeTimeOfThatDay, (period + 1))) {
            setSelected(true)
        }
        periods.push(
            <div
                key={period}
                className={'period ' + (selected ? "selected" : "")}
                onClick={() => periodClickHandler(period)}>
                {period + 1}
            </div>
        )
    }
    const periodClickHandler = useCallback((period: number) => {
        modifyTheValueOfInputBox(`[${day + 1},${[period + 1]}]`, selected);
    }, [modifyTheValueOfInputBox, selected])

    return (
        <div className='periods-container' >
            {periods}
        </div>
    )
})

export default memo(TeachersPage)