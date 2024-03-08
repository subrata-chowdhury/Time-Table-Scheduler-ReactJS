import { url } from "./fetchUrl"

export function getSubjectList(callBackFunction = (data) => { }, setSubjectsList) {
    let status;
    try {
        fetch(`${url}io/subjects`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    return;
                }
                let listArray = [];
                try {
                    listArray = JSON.parse(data);
                    listArray = Object.keys(listArray)
                } catch (error) {
                    console.log("data is invaild")
                }
                callBackFunction(listArray);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
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
                    return;
                }
                let listArray = [];
                try {
                    listArray = JSON.parse(data);
                } catch (error) {
                    console.log("data is invaild")
                }
                callBackFunction(listArray);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}

export async function getSubjectDetails(subjectName, callBackFunction = (data) => { }) {
    let response, data;
    try {
        response = await fetch(`${url}io/subjects/${subjectName}`)
        data = await response.json();
        callBackFunction(data)
    } catch {
        console.log("Something went wrong")
    }
    return data
}

export function saveSubject(data, callBackFunction = () => { }) {
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
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("data is invaild")
    }
}

export function deleteSubject(subjectName, callBackFunction = () => { }) {
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
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("unable to send request")
    }
}
