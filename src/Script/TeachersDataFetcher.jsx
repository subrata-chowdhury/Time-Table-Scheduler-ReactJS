import { url } from "./fetchUrl"


export function getTeacherList(callBackFunction) {
    let status;
    try {
        fetch(`${url}io/teachers`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting teacher list", "color: orange", data)
                    return;
                }
                let listArray;
                try {
                    listArray = JSON.parse(data);
                    listArray = Object.keys(listArray)
                } catch (error) {
                    console.log("%cTeacher list data is invaild", "color: orange;", data)
                }
                callBackFunction(listArray);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Teachers List")
    }
}

export function getTeacher(sirName, callBackFunction) {
    let status;
    try {
        fetch(`${url}io/teachers/${sirName}`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log(`Request URL: %c${url}io/teachers/${sirName} \n%cError in getting teacher details`, "color: blue;", "color: orange;", data)
                    return;
                }
                let teacherData;
                try {
                    teacherData = JSON.parse(data);
                } catch (error) {
                    console.log("%cTeacher details data is invaild", "color: red;", data)
                }
                callBackFunction(teacherData);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Teacher Details")
    }
}

export function getTeacherSchedule(sirName, callBackFunction) {
    let status;
    try {
        fetch(`${url}io/schedule/teacher/${sirName}`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log(`Request URL: %c${url}io/schedule/teacher/${sirName} \n%cError in getting teacher schedule`, "color: blue;", "color: orange;", data)
                    return;
                }
                let schedule;
                try {
                    schedule = JSON.parse(data);
                } catch (error) {
                    console.log("%cTeacher schedule data is invaild", "color: orange;", data)
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Teacher Schedule")
    }
}


export function saveTeacher(data, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    let statusValue;
    try {
        let body = JSON.stringify(data)
        fetch(url + "io/teachers", {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: body
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text()
            })
            .then(data => {
                if (statusValue !== 200) {
                    alert("Something went wrong");
                    console.log("%cError in Saving teacher details", "color: orange;", data)
                    callBackIfFailed()
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("%cTeacher details data is invaild or %cUnable to call Fetch", "color: red;", "color: orange;", data)
    }
}



export function deleteTeacher(teacherName, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    let statusValue;
    try {
        fetch(url + "io/teachers/" + teacherName, {
            method: "DELETE"
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text()
            })
            .then(data => {
                if (statusValue !== 200) {
                    alert("Something went wrong");
                    console.log(`Request URL: %c${url}io/teachers/${teacherName} %cUnable to delete teacher`, "color: blue;", "color: orange;", data)
                    callBackIfFailed()
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("unable to send request of teacher deletion")
    }
}