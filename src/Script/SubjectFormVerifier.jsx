export const verifySubjectInputs = (subjectName, subjectDetails) => {
    let data = { ...subjectDetails }
    let newSubjectName = subjectName.trim().toUpperCase() // string

    // name must not contain any special character
    if (newSubjectName.length > 100) {
        alert("Length of the name must be less than 100");
        return false;
    }
    // name can't be empty
    if (newSubjectName.length === 0) {
        alert("Please Enter a Subject Name");
        return false;
    }
    // name must not contain greater then 100 characters
    // const regExp = /[^\w\s()\-_]/; // reg exp for containing special characters except white space and ()-_
    // if (regExp.test(newSubjectName)) {
    //     alert("Only Character, Number & Space is allowed")
    //     return false
    // }

    // sem value can't be empty
    if (data.sem.length === 0) {
        alert("Please Enter a Number in semester");
        return false;
    }
    // sem value must be a number
    if (typeof parseInt(data.sem) === "number") {
        data.sem = parseInt(data.sem);
    } else {
        alert("Please Enter a number in semester");
        return false;
    }
    // must be a positive number
    if (data.sem < 0) {
        alert("Please Enter a positive number in semester");
        return false;
    }
    // sem value must be an integer value
    if (!Number.isInteger(data.sem)) {
        alert("Value must be an integer")
        return false
    }

    // lecture count can't be empty or 0
    if (data.lectureCount === 0 || data.lectureCount === "") {
        data.lectureCount = 4; // default value
    }
    // lecture count must be a number
    if (typeof parseInt(data.lectureCount) === 'number') {
        data.lectureCount = parseInt(data.lectureCount);
    } else {
        alert("Please Enter a number in lecture count per week");
        return false;
    }
    // lecture count value must stay between 0 to 40
    if (data.lectureCount < 0 || data.lectureCount > 40) {
        alert("Value must be in range 0 to 40 in lecture count per week");
        return false;
    }
    // lecture count value can't be a float number
    if (!Number.isInteger(data.lectureCount)) {
        alert("Value must be an integer")
        return false
    }

    // room code can't be empty
    if (data.roomCodes.length <= 0) {
        alert("Please Press Enter After Entering Room Code");
        return false
    }
    return { newSubjectName, data }
}