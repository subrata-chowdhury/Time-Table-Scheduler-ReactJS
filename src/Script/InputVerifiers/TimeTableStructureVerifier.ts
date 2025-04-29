export default function verifyTimeTableStructureInputs(timeTableStructureFieldValues: any, onError: (msg: string) => void = () => { }) {
    let timeTableStructure = Object();

    //Validating year count
    if (!timeTableStructureFieldValues.semesterCount) {
        onError("semester count can't be empty");
        return false;
    }
    // must be an positive integer number
    let semesterCount = timeTableStructureFieldValues.semesterCount
    if (!isPositiveWholeNumber(semesterCount)) {
        onError("Please enter a valid year count");
        return false;
    }
    timeTableStructure.semesterCount = semesterCount;

    //Validating period count
    if (!timeTableStructureFieldValues.periodCount) {
        onError("period count can't be empty");
        return false;
    }
    // must be an positive integer number
    let periodCount = timeTableStructureFieldValues.periodCount;
    if (!isPositiveWholeNumber(periodCount)) {
        onError("Please enter a valid period count");
        return false;
    }
    timeTableStructure.periodCount = periodCount;

    //Validating sections per year
    if (!timeTableStructureFieldValues.sectionsPerSemester) {
        onError("period count can't be empty");
        return false;
    }
    let sectionsPerSemester;
    try {
        sectionsPerSemester = timeTableStructureFieldValues.sectionsPerSemester;
    } catch (error) {
        sectionsPerSemester = "";
        onError("Please enter sections per year in correct format");
        return false;
    }
    if (!sectionsPerSemester) return false;
    if (!((sectionsPerSemester instanceof Array) && sectionsPerSemester.every((value) => isPositiveWholeNumber(value)))) {
        onError("Please enter sections per year in correct format");
        return false;
    }
    if (sectionsPerSemester.length !== timeTableStructure.semesterCount) {
        onError("Number of year in sections per year must be equal to year count");
        return false;
    }
    timeTableStructure.sectionsPerSemester = sectionsPerSemester;

    //Validating breaks per year
    if (!timeTableStructureFieldValues.breaksPerSemester) {
        onError("period count can't be empty");
        return false;
    }
    let breaksPerSemester;
    try {
        breaksPerSemester = timeTableStructureFieldValues.breaksPerSemester;
    } catch (error) {
        breaksPerSemester = "";
        onError("Please enter break locations per year in correct format");
        return false;
    }
    if (!breaksPerSemester) return false;
    if (!((breaksPerSemester instanceof Array) && breaksPerSemester.every(
        (subarr) =>
            (subarr instanceof Array) &&
            subarr.every(
                (value) => isPositiveWholeNumber(value)
            )
    ))) {
        onError("Please enter break locations per year in correct format");
        console.log(timeTableStructure);
        return false;
    }
    if (breaksPerSemester.length !== timeTableStructure.semesterCount) {
        onError("Number of semesters in break locations per year must be equal to year count");
        return false;
    }
    if (
        !((breaksPerSemester instanceof Array) && breaksPerSemester.every(
            (subarr) =>
                (subarr instanceof Array) &&
                subarr.every(
                    (value) => (value <= timeTableStructure.periodCount)
                )
        ))
    ) {
        onError("Break locations must be lesser than or equal to period count");
        return false;
    }
    timeTableStructure.breaksPerSemester = breaksPerSemester;

    if(timeTableStructure.dayCount === 0 || timeTableStructure.dayCount > 7) {
        onError("Please select a valid number of days in a week");
        return false;
    }
    timeTableStructure.dayCount = timeTableStructureFieldValues.dayCount;
    return timeTableStructure;
}

const isPositiveWholeNumber = (num: number) => {
    if (!Number.isInteger(num) || num < 0 || Number.isNaN(num)) return false;
    else return true;
}