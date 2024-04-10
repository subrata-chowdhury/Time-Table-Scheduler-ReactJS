import { getApiToken, url } from "./fetchUrl"


export async function getTeacherList(callBackFunction) {
    try {
        let response = await fetch(`${url}io/teachers`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
        let listArray = [];
        if (response.status === 200) {
            try {
                listArray = await response.json();
                listArray = Object.keys(listArray)
            } catch (error) {
                console.log("%cTeacher list data is invaild", "color: orange;", await response.text())
            }
            callBackFunction(listArray);
        } else {
            callBackFunction(listArray)
            console.log("%cError in getting teacher list", "color: orange", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Teachers List")
    }
}

export async function getTeacher(sirName, callBackFunction) {
    try {
        let response = await fetch(`${url}io/teachers/${sirName}`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
        if (response.status === 200) {
            let teacherData;
            try {
                teacherData = await response.json();
            } catch (error) {
                console.log("%cTeacher details data is invaild", "color: red;", await response.text())
            }
            callBackFunction(teacherData);
        } else {
            console.log(`Request URL: %c${url}io/teachers/${sirName} \n%cError in getting teacher details`, "color: blue;", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Teacher Details")
    }
}

export async function getTeacherSchedule(sirName, callBackFunction) {
    try {
        let response = await fetch(`${url}io/schedule/teacher/${sirName}`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
        if (response.status === 200) {
            let schedule;
            try {
                schedule = await response.json();
            } catch (error) {
                console.log("%cTeacher schedule data is invaild", "color: orange;", await response.text())
            }
            callBackFunction(schedule);
        } else {
            console.log(`Request URL: %c${url}io/schedule/teacher/${sirName} \n%cError in getting teacher schedule`, "color: blue;", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Teacher Schedule")
    }
}


export async function saveTeacher(data, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    try {
        let body = JSON.stringify(data)
        let response = await fetch(url + "io/teachers", {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'Api-Token': getApiToken()
            },
            body: body
        })
        if (response.status === 200) callBackFunction();
        else {
            alert("Something went wrong");
            console.log("%cError in Saving teacher details", "color: orange;", await response.text())
            callBackIfFailed()
        }
    } catch (error) {
        console.log("%cTeacher details data is invaild or %cUnable to call Fetch", "color: red;", "color: orange;", data)
    }
}



export async function deleteTeacher(teacherName, callBackFunction = () => { }, callBackIfFailed = () => { }) {
    try {
        let response = await fetch(url + "io/teachers/" + teacherName, {
            method: "DELETE",
            headers: {
                'Api-Token': getApiToken()
            }
        })
        if (response.status === 200) callBackFunction();
        else {
            alert("Something went wrong");
            console.log(`Request URL: %c${url}io/teachers/${teacherName} %cUnable to delete teacher`, "color: blue;", "color: orange;", await response.text())
            callBackIfFailed()
        }
    } catch (error) {
        console.log("unable to send request of teacher deletion")
    }
}