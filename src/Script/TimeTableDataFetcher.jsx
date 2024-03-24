import { url } from "./fetchUrl"

export function generateTimeTable(callBackFunction, callBackIfFailed) {
    try {
        let status;
        fetch(`${url}io/schedule?generateNew=True`)
            .then(Response => {
                status = Response.status;
                return Response.text();
            })
            .then(data => {
                if (status !== 200) {
                    alert("Failed to generate beacause: " + data);
                    console.log("%cError in generating Time Table", "color: orange;", data)
                    callBackIfFailed()
                    return
                }
                callBackFunction(data)
            })
    } catch (error) {
        console.log("Unable to call Fetch of Generate Time Table")
    }
}

export function getSchedule(callBackFunction) {
    let status;
    try {
        fetch(`${url}io/schedule`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting schedule data", "color: orange;", data)
                    return;
                }
                let schedule;
                try {
                    schedule = JSON.parse(data)
                } catch (error) {
                    console.log("%cInvaild schedule data", "color: red;", data)
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unable to Fetch Schedule Data")
    }
}

export function saveSchedule(data, callBackFunction, callBackIfFailed = () => { }) {
    let status;
    try {
        data = JSON.stringify(data);
        fetch(`${url}io/schedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    alert("Something went wrong")
                    console.log("%cError in saving schedule data", "color: orange;", data)
                    callBackIfFailed();
                    return;
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unable to call Fetch of Save Schedule Data")
    }
}

export function getTimeTableStructure(callBackFunction) {
    let status;
    try {
        fetch(`${url}io/schedule/structure`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in fetching time table structure", "color: red;", data)
                    return;
                }
                let schedule = "";
                // {
                //     breaksPerSemester: [],
                //     periodCount: 0,
                //     sectionsPerSemester: [],
                //     semesterCount: 0,
                // };
                try {
                    schedule = JSON.parse(data);
                } catch (error) {
                    console.log("%cInvaild data of time table structure", "color: red;", data)
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Time table structure")
    }
}

export function saveTimeTableStructure(data, callBackFunction = () => { }) {
    let status;
    try {
        data = JSON.stringify(data)
        fetch(`${url}io/schedule/structure`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    alert("Something went wrong")
                    console.log("%cError in saving time table structure data", "color: orange;", data)
                    return;
                }
                callBackFunction()
            });
    } catch (error) {
        console.log("%cTime table structure data is invaild or %cUnable to call Fetch", "color: red;", "color: orange;", data)
    }
}