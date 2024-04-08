export const verifyTeacherInputs = (teacherName, teacherDetails, subjectList) => {
    let teacherData = { ...teacherDetails };
    let newTeacherName = teacherName.trim().toUpperCase();
    if (newTeacherName.length === 0) {
        alert("Please Enter Teacher Name");
        return false;
    }
    if (newTeacherName.length > 100) {
        alert("Length of the name must be less than 100");
        return false;
    }
    if (teacherData.subjects.length <= 0) {
        alert("Please Press Enter After Entering A Subject Name")
        return false;
    }
    for (let subjectStr of teacherData.subjects) {
        if (subjectList.current !== "unavailable" && subjectList.current.indexOf(subjectStr) === -1) {
            alert("Couldn't find subject - " + subjectStr);
            return false;
        }
    }
    if (teacherData.freeTime.length <= 0) {
        teacherData.freeTime = [];
    }
    return { newTeacherName, teacherData }
}