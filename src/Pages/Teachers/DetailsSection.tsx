import { FormEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { deleteTeacher, getTeacher, saveTeacher } from "../../Script/TeachersDataFetcher";
import { getSubjectsList } from "../../Script/SubjectsDataFetcher";
import { Teacher } from "../../data/Types";
import { hasElement } from "../../Script/util";
import { verifyTeacherInputs } from "../../Script/InputVerifiers/TeacherFormVerifier";
import TagInput from "../../Components/TagInput";
import TimeSelector from "./TimeSelector";
import { useAlert } from "../../Components/AlertContextProvider";
import { useConfirm } from "../../Components/ConfirmContextProvider";

interface DetailsContainerProps {
    active?: boolean,
    activeTeacherName: string,
    teachersList: string[],
    onSubmitCallBack: () => void,

    setDisplayLoader: React.Dispatch<React.SetStateAction<boolean>>
    onClose?: () => void
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({
    active = false,
    activeTeacherName = "",
    teachersList,
    onSubmitCallBack,

    setDisplayLoader,
    onClose = () => { }
}) => {
    const [teacherName, setTeacherName] = useState<string>(activeTeacherName);
    const [teacherDetails, setTeacherDetails] = useState<Teacher>({
        freeTime: [],
        subjects: [],
    });
    const [disabled, setDisabled] = useState<boolean>(false)
    const [inEditState, setInEditState] = useState<boolean>(false)

    const subjectList = useRef<string[] | undefined>([]);

    const { showWarning, showError, showSuccess } = useAlert();
    const { showWarningConfirm } = useConfirm()

    useEffect(() => {
        setTeacherName(activeTeacherName)
        if (activeTeacherName === "") {
            setTeacherDetails({ freeTime: [], subjects: [] })
            setInEditState(false)
        } else {
            getTeacher(activeTeacherName, setTeacherDetails) // api call
            setInEditState(true)
        };
    }, [activeTeacherName])

    useEffect(() => {
        getSubjectsList(data => subjectList.current = data) // api call
    }, [])


    const updateTeacherFreeTimeDetails = useCallback((time: [number, number], active: boolean) => {
        let newDetails: Teacher = { ...teacherDetails };
        if (active) {
            let found = -1;
            for (let index = 0; index < newDetails.freeTime.length; index++) {
                if (newDetails.freeTime[index][0] === time[0] && newDetails.freeTime[index][1] === time[1]) {
                    found = index;
                    break
                }
            }
            newDetails.freeTime.splice(found, 1);
        } else {
            newDetails.freeTime[newDetails.freeTime.length] = time;
        }
        setTeacherDetails(newDetails)
    }, [teacherDetails])

    const inputOnChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'teacherName') setTeacherName(event.target.value.toUpperCase())
        else setTeacherDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }, [])

    const checkIfAlreadyExist = useCallback((teacherName: string) => {
        if (hasElement(teachersList, teacherName)) setInEditState(true) // if teacher exist show delete btn
        else setInEditState(false) // if not teacher exist show delete btn
    }, [teachersList])

    const teacherFormSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //verification of inputs
        let verifiedData = verifyTeacherInputs(teacherName, teacherDetails, subjectList, showWarning)
        if (verifiedData)
            if (hasElement(teachersList, verifiedData.newTeacherName)) { // checking if the teacher exsist or not
                showWarningConfirm("Are you want to overwrite " + teacherName, // if exist show a confirmation box
                    () => saveData(verifiedData.newTeacherName, verifiedData.teacherData) // if yes then save else do nothing
                )
            } else saveData(verifiedData.newTeacherName, verifiedData.teacherData);
    }, [teacherName, teacherDetails, teachersList])

    const saveData = useCallback((teacherName: string, teacherData: Teacher) => {
        setDisplayLoader(true)
        setDisabled(true)
        saveTeacher(teacherName, teacherData, () => { // api call
            showSuccess(JSON.stringify({ teacherName, teacherData }) + "---------- is added")
            onSubmitCallBack(); // referenced to start up function
        }, (msg) => showError(msg || "Someting went Wrong!")).then(() => {
            setDisplayLoader(false)
            setDisabled(false)
        }).catch(() => {
            setDisplayLoader(false)
            setDisabled(false)
        })
    }, [])

    const deleteTeacherBtnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (hasElement(teachersList, teacherName)) // checking if the teacher exsist or not
            showWarningConfirm("Are you sure? Want to Delete " + teacherName + " ?",
                () => { // if exist show a confirmation box
                    deleteTeacher(teacherName, () => { // api call
                        onSubmitCallBack(); // referenced to start up function
                        showSuccess(teacherName + " is deleted")
                    }, (msg) => {
                        showError(msg || "Someting went Wrong!")
                        setDisplayLoader(false) // if failed only hide loader
                    });
                }
            )
    }, [teacherName])

    return (
        <form className={'details-container' + (active ? ' active' : '')} onSubmit={teacherFormSubmitHandler}>
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
                        checkIfAlreadyExist(event.target.value.toUpperCase())
                        inputOnChangeHandler(event)
                    }}></input>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Subject Names</div>
                {subjectList.current && <TagInput
                    validTags={subjectList.current}
                    tagList={teacherDetails.subjects}
                    onChange={(data) => {
                        let newTeacherDetails = { ...teacherDetails, subjects: data }
                        setTeacherDetails(newTeacherDetails)
                    }}
                />}
            </div>
            <div className='input-container'>
                <div>Available Times</div>
                <TimeSelector
                    onChange={updateTeacherFreeTimeDetails}
                    selectedValues={teacherDetails.freeTime} />
            </div>
            <div className='save-btn-container'>
                <button className='teacher-save-btn' type='submit' disabled={disabled} >Save</button>
                {inEditState && <button className='teacher-delete-btn' onClick={deleteTeacherBtnClickHandler}>Delete</button>}
                <button className='teacher close-btn' onClick={e => {
                    e.preventDefault()
                    onClose()
                }}>Close</button>
            </div>
        </form>
    )
}

export default memo(DetailsContainer)