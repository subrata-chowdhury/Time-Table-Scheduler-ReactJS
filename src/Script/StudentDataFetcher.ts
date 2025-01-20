import { Student } from "../data/Types";
import { url, getApiToken } from "./fetchUrl";

export const getStudents = async (
    onSuccess: (data: Student[]) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<Student[]> => {
    try {
        const response = await fetch(`${url}io/students`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        let listArray: Map<string, Student> = new Map();
        if (response.status === 200) {
            try {
                listArray = await response.json();
                listArray = new Map(Object.entries(listArray));
                let newListArray = Array.from(listArray.values())
                onSuccess(newListArray);
                return newListArray
            } catch (error) {
                const text = await response.text();
                console.log("%cSubject List Data is invaild", "color: orange;", text);
            }
            return [];
        } else {
            const text = await response.text();
            onFailed([]);
            console.log("%cError in getting subject list", "color: orange;", text);
            return [];
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Subject List");
        throw error;
    }
}

export const getStudent = async (
    studentId: string | number,
    onSuccess: (data: Student) => void = () => { },
    onFailed: (data: string) => void = () => { }
): Promise<Student | null> => {
    try {
        const response = await fetch(`${url}io/students/${studentId}`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            const data = await response.json();
            onSuccess(data);
            return data;
        } else {
            const text = await response.text();
            onFailed(text);
            console.log("%cError in getting student data", "color: orange;", text);
            return null;
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Student");
        throw error;
    }
}

export const setStudents = async (
    students: Student[],
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string) => void = () => { }
): Promise<void> => {
    const newStudents: { [key: string]: Student } = {};

    for (let index = 0; index < students.length; index++) {
        newStudents[students[index].rollNo] = students[index];
    }

    try {
        const response = await fetch(`${url}io/students`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': await getApiToken()
            },
            body: JSON.stringify(newStudents)
        });
        if (response.status === 200) {
            onSuccess("Student added successfully");
        } else {
            const text = await response.text();
            onFailed(text || "Failed to add student");
            console.log("%cError in adding student", "color: orange;", text);
        }
    } catch (error) {
        console.log("Unable to Add Student");
        throw error;
    }
}

export const deleteStudents = async (
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<void> => {
    try {
        const response = await fetch(`${url}io/students`, {
            method: 'DELETE',
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            onSuccess("Students deleted successfully");
        } else {
            const text = await response.text();
            onFailed(["Failed to delete students"]);
            console.log("%cError in deleting students", "color: orange;", text);
        }
    } catch (error) {
        console.log("Unable to Delete Students");
        throw error;
    }
}

export const deleteStudent = async (
    studentId: string | number,
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<void> => {
    try {
        const response = await fetch(`${url}io/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            onSuccess("Student deleted successfully");
        } else {
            const text = await response.text();
            onFailed(["Failed to delete student"]);
            console.log("%cError in deleting student", "color: orange;", text);
        }
    } catch (error) {
        console.log("Unable to Delete Student");
        throw error;
    }
}