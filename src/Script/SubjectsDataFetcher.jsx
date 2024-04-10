import { getApiToken, url } from "./fetchUrl"

export async function getSubjectList(callBackFunction = (data) => { }) {
    try {
        let apiToken = await getApiToken()
        while (!apiToken) { } // wait until server apiToken value is null
        let response = await fetch(`${url}io/subjects`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        let listArray = [];
        if (response.status === 200) {
            try {
                listArray = await response.json()
                listArray = Object.keys(listArray)
            } catch (error) {
                console.log("%cSubject List Data is invaild", "color: orange;", await response.text())
            }
            callBackFunction(listArray);
        } else {
            callBackFunction(listArray)
            console.log(apiToken)
            console.log("%cError in getting subject list", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Subject List")
    }
}

export async function getSubjects(callBackFunction = (data) => { }, setSubjectsList) {
    try {
        let apiToken = await getApiToken()
        while (!apiToken) { } // wait until server apiToken value is null
        let response = await fetch(`${url}io/subjects`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            let listArray = [];
            try {
                listArray = await response.json();
            } catch (error) {
                console.log("%cSubjects Data is invaild", "color: orange;", await response.text())
            }
            callBackFunction(listArray);
        } else {
            console.log("%cError in getting subjects details", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of subjects")
    }
}

export async function getSubjectDetails(subjectName, callBackFunction = (data) => { }) {
    try {
        let apiToken = await getApiToken()
        while (!apiToken) { } // wait until server apiToken value is null
        let response = await fetch(`${url}io/subjects/${subjectName}`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            let data;
            try {
                data = await response.json();
            } catch (error) {
                console.log("%cSubject Details Data is invaild", "color: red;", await response.text())
            }
            callBackFunction(data);
        } else {
            console.log(`Request URL: %c${url}io/subjects/${subjectName} \n%cError in getting subject details data`, "color: blue;", "color: orange;", await response.text())
        }
    } catch {
        console.log("Unable to Fetch Data of subject")
    }
}

export async function saveSubject(data, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    try {
        let subjectData = JSON.stringify(data)
        let apiToken = await getApiToken()
        while (!apiToken) { } // wait until server apiToken value is null
        let response = await fetch(url + "io/subjects", {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'Api-Token': apiToken
            },
            body: subjectData
        })
        if (response.status === 200)
            callBackFunction();
        else {
            alert("Something went wrong");
            console.log("%cError in Saveing Subject Details", "color: orange;", await response.text())
            callBackIfFailed()
        }
    } catch (error) {
        console.log("%cData is invaild of the Subject details or %cUnable to use Fetch call", "color: red;", "color: orange;", data)
    }
}

export async function deleteSubject(subjectName, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    try {
        let apiToken = await getApiToken()
        while (!apiToken) { } // wait until server apiToken value is null
        let response = await fetch(url + "io/subjects/" + subjectName, {
            method: "DELETE",
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200)
            callBackFunction()
        else {
            alert("Something went wrong");
            console.log("%cError in Deleteing Subject", "color: red;", subjectName, await response.text())
            callBackIfFailed()
        }
    } catch (error) {
        console.log("unable to send request of delete subject")
    }
}
