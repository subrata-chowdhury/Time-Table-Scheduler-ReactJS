import { studentsData } from "../data/SampleData";
import { Student } from "../data/Types";
// import { url, getApiToken } from "./fetchUrl";

export const getStudents = async (
    onSuccess: (data: Student[]) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<Student[]> => {

    return new Promise<Student[]>((resolve, reject) => {
        setTimeout(() => {
            try {
                const listArray = studentsData || [];
                onSuccess(studentsData);
                resolve(listArray);
            } catch (error) {
                onFailed(["Failed to fetch subjects"]);
                reject(error);
            }
        }, 200); // Simulate a delay for the API call
    });
    // try {
    //     const response = await fetch(`${url}io/students`, {
    //         headers: {
    //             'Api-Token': await getApiToken()
    //         }
    //     });
    //     let listArray: string[] = [];
    //     if (response.status === 200) {
    //         try {
    //             listArray = await response.json();
    //         } catch (error) {
    //             const text = await response.text();
    //             console.log("%cSubject List Data is invaild", "color: orange;", text);
    //         }
    //         onSuccess(listArray);
    //         return listArray;
    //     } else {
    //         const text = await response.text();
    //         onFailed(listArray);
    //         console.log("%cError in getting subject list", "color: orange;", text);
    //         return [];
    //     }
    // } catch (error) {
    //     console.log("Unable to Fetch Data of Subject List");
    //     throw error;
    // }
}

export const addStudent = async (
    //@ts-ignore
    student: Student,
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            try {
                onSuccess("Student added successfully");
                resolve();
            } catch (error) {
                onFailed(["Failed to add student"]);
                reject(error);
            }
        }, 200); // Simulate a delay for the API call
    });
}

export const updateStudent = async (
    //@ts-ignore
    student: Student,
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            try {
                onSuccess("Student updated successfully");
                resolve();
            } catch (error) {
                onFailed(["Failed to update student"]);
                reject(error);
            }
        }, 200); // Simulate a delay for the API call
    });
}

export const deleteStudents = async (
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            try {
                onSuccess("Students deleted successfully");
                resolve();
            } catch (error) {
                onFailed(["Failed to delete students"]);
                reject(error);
            }
        }, 200); // Simulate a delay for the API call
    });
}

export const deleteStudent = async (
    //@ts-ignore
    studentId: string | number,
    onSuccess: (data: string) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            try {
                onSuccess("Student deleted successfully");
                resolve();
            } catch (error) {
                onFailed(["Failed to delete student"]);
                reject(error);
            }
        }, 200); // Simulate a delay for the API call
    });
}