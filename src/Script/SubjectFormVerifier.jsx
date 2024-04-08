export const verifySubjectInputs = (subjectName, subjectDetails) => {
    let data = { ...subjectDetails }
    let newSubjectName = subjectName.trim().toUpperCase()

    //form validating
    if (newSubjectName.length > 100) {
        alert("Length of the name must be less than 100");
        return false;
    }
    if (newSubjectName.length === 0) {
        alert("Please Enter a Subject Name");
        return false;
    }
    //sem validation
    if (data.sem.length === 0) {
        alert("Please Enter a Number in semester");
        return false;
    }
    if (parseInt(data.sem)) {
        data.sem = parseInt(data.sem);
    } else {
        alert("Please Enter a number in semester");
        return false;
    }
    if (data.sem < 1 || data.sem > 8) {
        alert("Value must be in 1 to 8 range in semester");
        return false;
    }
    //lecture count validation
    if (data.lectureCount === 0 || data.lectureCount === "") {
        data.lectureCount = 4;
    }
    if (parseInt(data.lectureCount)) {
        data.lectureCount = parseInt(data.lectureCount);
    } else {
        alert("Please Enter a number in lecture count per week");
        return false;
    }
    if (data.lectureCount < 0 || data.lectureCount > 40) {
        alert("Value must be in range 0 to 40 in lecture count per week");
        return false;
    }
    //room code validation
    if (data.roomCodes.length <= 0) {
        alert("Please Press Enter After Entering Room Code");
        return false
    }
    return { newSubjectName, data }
}