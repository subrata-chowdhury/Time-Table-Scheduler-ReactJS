import { Teacher } from "../../data/Types";

export const verifyTeacherInputs = (teacherName: string, teacherDetails: Teacher, subjectList: any, onError: (msg: string) => void = () => { }) => {
    let teacherData = { ...teacherDetails };
    let newTeacherName = teacherName.trim().toUpperCase();

    // name can't be empty
    if (newTeacherName.length === 0) {
        onError("Please Enter Teacher Name");
        return false;
    }
    // name must not contain any special character
    const regExp = /[^\w\s]/ // reg exp for containing special character
    if (regExp.test(newTeacherName)) {
        onError("Only Character, Number & Space is allowed");
        return false;
    }
    // name must not contain greater then 100 characters
    if (newTeacherName.length > 100) {
        onError("Length of the name must be less than 100");
        return false;
    }


    // aleast one subject is need to present
    if (teacherData.subjects.length <= 0) {
        onError("Please Press Enter After Entering A Subject Name");
        return false;
    }
    // subject need to be present in subjects tab (already verified in per user input)
    for (let subjectStr of teacherData.subjects) {
        if (subjectList.current !== "unavailable" && subjectList.current.indexOf(subjectStr) === -1) {
            onError("Couldn't find subject - " + subjectStr);
            return false;
        }
    }

    // free time must be an empty array alleast
    if (teacherData.freeTime.length <= 0) {
        teacherData.freeTime = [];
    } else { // free time must ne an array which will contain elements with length 2 with only 2 positive numbers
        if (!Array.isArray(teacherData.freeTime)) {
            onError("free time must be an array");
            return false;
        }
        for (let index = 0; index < teacherData.freeTime.length; index++) {
            if (!Array.isArray(teacherData.freeTime[index])) {
                onError("Each element of free time must be an array");
                return false;
            }
            if (teacherData.freeTime[index].length !== 2) {
                onError("Length of each element must be 2");
                return false;
            }
            if (typeof teacherData.freeTime[index][0] !== 'number' && typeof teacherData.freeTime[index][1] !== 'number') {
                onError("day & week index must be a number");
                return false;
            }
            if (teacherData.freeTime[index][0] < 0 && teacherData.freeTime[index][1] < 0) {
                onError("day & week index value must be positive or zero");
                return false;
            }
            if (!Number.isInteger(teacherData.freeTime[index][0]) && !Number.isInteger(teacherData.freeTime[index][1])) {
                onError("day & week index values must be an integer");
                return false;
            }
        }
    }
    return { newTeacherName, teacherData };
}