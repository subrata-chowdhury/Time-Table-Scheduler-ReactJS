export default function verifyTimeTableStructureInputs(timeTableStructureFieldValues) {
    let timeTableStructure = Object()

    //Validating year count
    if (!timeTableStructureFieldValues.semesterCount || timeTableStructureFieldValues.semesterCount.length === 0) {
        alert("semester count can't be empty")
        return false
    }
    // must be an positive integer number
    let semesterCount = Number.parseInt(timeTableStructureFieldValues.semesterCount)
    if (!isPositiveWholeNumber(semesterCount)) {
        alert("Please enter a valid year count")
        return false
    }
    timeTableStructure.semesterCount = semesterCount

    //Validating period count
    if (!timeTableStructureFieldValues.periodCount || timeTableStructureFieldValues.periodCount.length === 0) {
        alert("period count can't be empty")
        return false
    }
    // must be an positive integer number
    let periodCount = Number.parseInt(timeTableStructureFieldValues.periodCount)
    if (!isPositiveWholeNumber(periodCount)) {
        alert("Please enter a valid period count")
        return false
    }
    timeTableStructure.periodCount = periodCount

    //Validating sections per year
    if (!timeTableStructureFieldValues.sectionsPerSemester || timeTableStructureFieldValues.sectionsPerSemester.length === 0) {
        alert("period count can't be empty")
        return false
    }
    let sectionsPerSemester
    try {
        sectionsPerSemester = JSON.parse(`[${timeTableStructureFieldValues.sectionsPerSemester}]`)
    } catch (error) {
        sectionsPerSemester = ""
        alert("Please enter sections per year in correct format")
        return false
    }
    if (!sectionsPerSemester) return false
    if (!((sectionsPerSemester instanceof Array) && sectionsPerSemester.every(
        (value) => isPositiveWholeNumber(value)
    ))) {
        alert("Please enter sections per year in correct format")
        return false
    }
    if (sectionsPerSemester.length !== timeTableStructure.semesterCount) {
        alert("Number of year in sections per year must be equal to year count")
        return false
    }
    timeTableStructure.sectionsPerSemester = sectionsPerSemester

    //Validating breaks per year
    if (!timeTableStructureFieldValues.breaksPerSemester || timeTableStructureFieldValues.breaksPerSemester.length === 0) {
        alert("period count can't be empty")
        return false
    }
    let breaksPerSemester
    try {
        breaksPerSemester = JSON.parse(`[${timeTableStructureFieldValues.breaksPerSemester}]`)
    } catch (error) {
        breaksPerSemester = ""
        alert("Please enter break locations per year in correct format")
        return false
    }
    if (!breaksPerSemester) return false
    if (!((breaksPerSemester instanceof Array) && breaksPerSemester.every(
        (subarr) =>
            (subarr instanceof Array) &&
            subarr.every(
                (value) => isPositiveWholeNumber(value)
            )
    ))) {
        alert("Please enter break locations per year in correct format")
        return false
    }
    if (breaksPerSemester.length !== timeTableStructure.semesterCount) {
        alert("Number of semesters in break locations per year must be equal to year count")
        return false
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
        alert("Break locations must be lesser than or equal to period count")
        return false
    }
    timeTableStructure.breaksPerSemester = breaksPerSemester
    return timeTableStructure
}

const isPositiveWholeNumber = (num) => {
    if (!Number.isInteger(num) || num < 0 || Number.isNaN(num)) return false
    else return true
}