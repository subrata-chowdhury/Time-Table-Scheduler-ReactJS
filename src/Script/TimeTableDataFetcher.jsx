import { getApiToken, url } from "./fetchUrl"

export async function generateTimeTable(callBackFunction, callBackIfFailed) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/schedule?generateNew=True`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            let data;
            try {
                data = await response.json()
                callBackFunction(data)
            } catch (error) {
                console.log("%cInvalid Time Table Data", "color: orange", await response.text())
            }
        }
        else {
            alert("Failed to generate beacause: " + await response.text());
            callBackIfFailed()
            console.log("%cError in generating Time Table", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to call Fetch of Generate Time Table")
    }
}

export async function getSchedule(callBackFunction) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/schedule`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            let schedule;
            try {
                schedule = await response.json()
            } catch (error) {
                console.log("%cInvaild schedule data", "color: red;", await response.text())
            }
            callBackFunction(schedule);
        } else {
            console.log("%cError in getting schedule data", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Schedule Data")
    }
}

export async function saveSchedule(data, callBackFunction, callBackIfFailed = () => { }) {
    try {
        data = JSON.stringify(data);
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/schedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': apiToken
            },
            body: data,
        })
        if (response.status === 200)
            callBackFunction(schedule);
        else {
            alert("Something went wrong")
            console.log("%cError in saving schedule data", "color: orange;", await response.text())
            callBackIfFailed();
        }
    } catch (error) {
        console.log("Unable to call Fetch of Save Schedule Data")
    }
}

export async function getTimeTableStructure(callBackFunction) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/schedule/structure`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            let schedule = "";
            try {
                schedule = await response.json();
            } catch (error) {
                console.log("%cInvaild data of time table structure", "color: red;", await response.text())
            }
            callBackFunction(schedule);
        } else {
            console.log("%cError in fetching time table structure", "color: red;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Time table structure")
    }
}

export async function saveTimeTableStructure(data, callBackFunction = () => { }) {
    try {
        data = JSON.stringify(data)
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/schedule/structure`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': apiToken
            },
            body: data,
        })
        if (response.status === 200) callBackFunction()
        else {
            alert("Something went wrong")
            console.log("%cError in saving time table structure data", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("%cTime table structure data is invaild or %cUnable to call Fetch", "color: red;", "color: orange;", data)
    }
}