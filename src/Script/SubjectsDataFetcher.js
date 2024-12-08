import { getApiToken, url } from "./fetchUrl";
export const getSubjectsList = async (onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(`${url}io/subjects/codes`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        let listArray = [];
        if (response.status === 200) {
            try {
                listArray = await response.json();
            }
            catch (error) {
                const text = await response.text();
                console.log("%cSubject List Data is invaild", "color: orange;", text);
            }
            onSuccess(listArray);
            return listArray;
        }
        else {
            const text = await response.text();
            onFailed(listArray);
            console.log("%cError in getting subject list", "color: orange;", text);
            return [];
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of Subject List");
        throw error;
    }
};
export const getSubjectsDetailsList = async (onSuccess = () => { }) => {
    try {
        const response = await fetch(`${url}io/subjects`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let listArray = [];
            try {
                listArray = await response.json();
            }
            catch (error) {
                console.log("%cSubjects Data is invaild", "color: orange;", await response.text());
            }
            onSuccess(listArray);
            return listArray;
        }
        else {
            console.log("%cError in getting subjects details", "color: orange;", await response.text());
            return [];
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of subjects");
        throw error;
    }
};
export const getSubject = async (subjectName, onSuccess = () => { }) => {
    try {
        const response = await fetch(`${url}io/subjects/${subjectName}`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let data;
            try {
                data = await response.json();
            }
            catch (error) {
                console.log("%cSubject Details Data is invaild", "color: red;", await response.text());
            }
            onSuccess(data);
            return data;
        }
        else {
            console.log(`Request URL: %c${url}io/subjects/${subjectName} \n%cError in getting subject details data`, "color: blue;", "color: orange;", await response.text());
            return null;
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of subject");
        throw error;
    }
};
export const saveSubject = async (subjectName, subjectDetails, onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(url + `io/subjects/${subjectName}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'Api-Token': await getApiToken()
            },
            body: JSON.stringify(subjectDetails)
        });
        if (response.status === 200) {
            onSuccess();
            return subjectName;
        }
        else {
            console.log("%cError in Saveing Subject Details", "color: orange;", await response.text());
            onFailed();
            return null;
        }
    }
    catch (error) {
        console.log("%cData is invaild of the Subject details or %cUnable to use Fetch call", "color: red;", "color: orange;", subjectDetails);
        throw error;
    }
};
export const deleteSubject = async (subjectName, onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(url + "io/subjects/" + subjectName, {
            method: "DELETE",
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            onSuccess();
            return subjectName;
        }
        else {
            console.log("%cError in Deleteing Subject", "color: red;", subjectName, await response.text());
            onFailed();
            return null;
        }
    }
    catch (error) {
        console.log("unable to send request of delete subject");
        throw error;
    }
};
