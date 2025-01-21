import { Student } from "../../data/Types";

export const verifyStudentInputs = (studentDetails: Student, onError: (msg: string) => void = () => { }) => {
    let studentData = { 
        ...studentDetails,
        name: studentDetails.name.trim(),
        rollNo: studentDetails.rollNo.trim(),
        email: studentDetails.email.trim(),
        address: studentDetails.address ? studentDetails.address.trim() : studentDetails.address,
        phoneNumbers: studentDetails.phoneNumbers ? studentDetails.phoneNumbers.trim() : studentDetails.phoneNumbers
    };

    // name can't be empty
    if (studentData.name.trim().length === 0) {
        onError("Please Enter Student Name");
        return false;
    }
    // name must not contain any special character
    const nameRegExp = /[^\w\s]/; // reg exp for containing special character
    if (nameRegExp.test(studentData.name)) {
        onError("Only Character, Number & Space is allowed in name");
        return false;
    }
    // name must not contain greater than 100 characters
    // if (studentData.name.length > 100) {
    //     onError("Length of the name must be less than 100");
    //     return false;
    // }

    // roll number can't be empty
    if (studentData.rollNo.trim().length === 0) {
        onError("Please Enter Roll Number");
        return false;
    }

    // semester must be a positive integer
    if (!Number.isInteger(studentData.semester) || studentData.semester <= 0) {
        onError("Semester must be a positive integer");
        return false;
    }

    // section must be a positive integer
    if (!Number.isInteger(studentData.section) || studentData.section < 0) {
        onError("Section must be an integer");
        return false;
    }

    // email must be a valid email address
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExp.test(studentData.email)) {
        onError("Please Enter a Valid Email Address");
        return false;
    }

    // phone number, if provided, must be a valid phone number
    // if (studentData.phoneNumbers && !/^\d{10}$/.test(studentData.phoneNumbers)) {
    //     onError("Please Enter a Valid 10-digit Phone Number");
    //     return false;
    // }

    // attendance must be a number between 0 and 100
    if (typeof studentData.attendance !== 'number' || studentData.attendance < 0 || studentData.attendance > 100) {
        onError("Attendance must be a number between 0 and 100");
        return false;
    }

    return studentData;
};