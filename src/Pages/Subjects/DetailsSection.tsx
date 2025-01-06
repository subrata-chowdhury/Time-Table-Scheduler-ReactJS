import { memo } from "react";
import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { getSubject, saveSubject, deleteSubject } from "../../Script/SubjectsDataFetcher";
import TagInput from "../../Components/TagInput";
import { hasElement } from "../../Script/util";
import { verifySubjectInputs } from "../../Script/InputVerifiers/SubjectFormVerifier";
import { Subject } from "../../data/Types";
import { useAlert } from "../../Components/AlertContextProvider";
import { useConfirm } from "../../Components/ConfirmContextProvider";

interface DetailsContainerProps {
    active?: boolean,
    activeSubjectName: string,
    subjectsList: string[],
    onSubmitCallBack: () => void,
    setDisplayLoader: (value: boolean) => void,
    onClose?: () => void
}

type SubjectInput = {
    sem: number | string;
    lectureCount: number;
    isPractical: boolean;
    isFree: boolean;
    roomCodes: string[]
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({
    active = false,
    activeSubjectName = "",
    subjectsList,
    onSubmitCallBack,
    setDisplayLoader,
    onClose = () => { }
}) => {
    const [subjectName, setSubjectName] = useState<string>(activeSubjectName)
    const [subjectDetails, setSubjectDetails] = useState<Subject | SubjectInput>({
        isPractical: false,
        lectureCount: 4,
        roomCodes: [],
        sem: "",
        isFree: false
    })
    const [disabled, setDisabled] = useState<boolean>(false)
    const [inEditState, setInEditState] = useState<boolean>(false)

    const { showWarning, showSuccess, showError } = useAlert()
    const { showWarningConfirm } = useConfirm()

    useEffect(() => {
        setSubjectName(activeSubjectName)
        if (activeSubjectName !== "") {
            getSubject(activeSubjectName, setSubjectDetails) // api call
            setInEditState(true)
        } else {
            setSubjectDetails({
                isPractical: false,
                lectureCount: 4,
                roomCodes: [],
                sem: "",
                isFree: false
            })
            setInEditState(false)
        }
    }, [activeSubjectName])

    const inputOnChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'subjectName') setSubjectName(event.target.value.toUpperCase())
        else setSubjectDetails(value => ({ ...value, [event.target.name]: event.target.value }))
    }, [])

    const checkIfAlreadyExist = useCallback((subjectName: string) => {
        if (hasElement(subjectsList, subjectName)) setInEditState(true) // if subject exist show delete btn
        else setInEditState(false) // if not subject exist show delete btn
    }, [subjectsList])

    const subjectFormSubmitHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let verifiedData = verifySubjectInputs(subjectName, subjectDetails, showWarning)
        if (verifiedData)
            if (hasElement(subjectsList, verifiedData.newSubjectName)) {
                showWarningConfirm("Are you want to overwrite " + verifiedData.newSubjectName,
                    () => saveData(verifiedData.newSubjectName, verifiedData.data)
                )
            } else saveData(verifiedData.newSubjectName, verifiedData.data);
    }, [subjectName, subjectDetails, subjectsList])

    const saveData = useCallback((subjectName: string, subjectData: Subject) => {
        setDisplayLoader(true)
        setDisabled(true)
        saveSubject(subjectName, subjectData, () => { // api call
            showSuccess(JSON.stringify({ subjectName, subjectData }) + "---------- is added");
            onSubmitCallBack();
        }, (msg) => showError(msg || "Someting went Wrong!")).then(() => {
            setDisplayLoader(false)
            setDisabled(false)
        }).catch(() => {
            setDisplayLoader(false)
            setDisabled(true)
        })
    }, [])

    const deleteSubjectBtnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (hasElement(subjectsList, subjectName)) // checking if the subject exsist or not
            showWarningConfirm("Are You Sure? Want to Delete " + subjectName + " ?", // if exist show a confirmation box
                () => deleteSubject(subjectName, () => { // api call
                    onSubmitCallBack(); // referenced to start up function
                    showSuccess(subjectName + " is deleted")
                }, (msg) => {
                    showError(msg || "Someting went Wrong!")
                    setDisplayLoader(false) // if failed only hide loader
                })
            )
    }, [subjectName])

    return (
        <form className={'details-container' + (active ? " active" : "")} onSubmit={subjectFormSubmitHandler}>
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
                        checkIfAlreadyExist(event.target.value.toUpperCase())
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
                <div className={'box'} onClick={() => setSubjectDetails(value => ({ ...value, isPractical: !value["isPractical"] }))}>
                    <div className={'option' + (!subjectDetails.isPractical ? " active" : "")}>Theory</div>
                    <div className={'option' + (subjectDetails.isPractical ? " active" : "")}>Practical</div>
                </div>
            </div>
            <div className="input-container">
                <div className="input-box-heading">Should be Taken by<br /> Teacher</div>
                <div className={'box'} onClick={() => setSubjectDetails(value => ({ ...value, isFree: !value["isFree"] }))}>
                    <div className={'option' + (subjectDetails.isFree ? " active" : "")}>No</div>
                    <div className={'option' + (!subjectDetails.isFree ? " active" : "")}>Yes</div>
                </div>
            </div>
            <div className='save-btn-container'>
                <button className='subject-save-btn' type='submit' disabled={disabled}>Save</button>
                {inEditState && <button className='subject-delete-btn' onClick={deleteSubjectBtnClickHandler}>Delete</button>}
                <button className='subject close-btn' onClick={e => {
                    e.preventDefault()
                    onClose()
                }}>Close</button>
            </div>
        </form>
    )
}

export default memo(DetailsContainer)