import { url } from "./fetchUrl"

export function getSubjectList(callBackFunction = (data) => { }) {
    let status;
    try {
        fetch(`${url}io/subjects`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting subject list", "color: orange;", data)
                    return;
                }
                let listArray = [];
                try {
                    listArray = JSON.parse(data);
                    listArray = Object.keys(listArray)
                } catch (error) {
                    console.log("%cSubject List Data is invaild", "color: orange;", data)
                }
                callBackFunction(listArray);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Subject List")
    }
}

export function getSubjects(callBackFunction = (data) => { }, setSubjectsList) {
    let status;
    try {
        fetch(`${url}io/subjects`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting subjects details", "color: orange;", data)
                    return;
                }
                let listArray = [];
                try {
                    listArray = JSON.parse(data);
                } catch (error) {
                    console.log("%cSubjects Data is invaild", "color: orange;", data)
                }
                callBackFunction(listArray);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of subjects")
    }
}

export async function getSubjectDetails(subjectName, callBackFunction = (data) => { }) {
    let status;
    try {
        fetch(`${url}io/subjects/${subjectName}`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log(`Request URL: %c${url}io/subjects/${subjectName} \n%cError in getting subject details data`, "color: blue;", "color: orange;", data)
                    return;
                }
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    console.log("%cSubject Details Data is invaild", "color: red;", data)
                }
                callBackFunction(data);
            });
    } catch {
        console.log("Unable to Fetch Data of subject")
    }
}

export function saveSubject(data, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    let statusValue;
    try {
        let subjectData = JSON.stringify(data)
        fetch(url + "io/subjects", {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: subjectData
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text();
            })
            .then(data => {
                if (statusValue !== 200) {
                    alert("Something went wrong");
                    console.log("%cError in Saveing Subject Details", "color: orange;", data)
                    callBackIfFailed()
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("%cData is invaild of the Subject details or %cUnable to use Fetch call", "color: red;", "color: orange;", data)
    }
}

export function deleteSubject(subjectName, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    let statusValue; console.log(url + "/io/teachers/" + subjectName)
    try {
        fetch(url + "io/subjects/" + subjectName, {
            method: "DELETE"
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text()
            })
            .then(data => {
                if (statusValue !== 200) {
                    alert("Something went wrong");
                    console.log("%cError in Deleteing Subject", "color: red;", subjectName, data)
                    callBackIfFailed()
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("unable to send request of delete subject")
    }
}
