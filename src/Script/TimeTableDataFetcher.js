import { url } from "./fetchUrl"

export function generateTimeTable(callBackFunction) {
    let status;
    fetch(`${url}io/schedule?generateNew=True`)
        .then(Response => {
            status = Response.status;
            return Response.text();
        })
        .then(data => {
            if (status !== 200) {
                alert("Failed to generate beacause:<br>" + data);
                return
            }
            callBackFunction(data)
        })
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
                    return;
                }
                let schedule;
                try {
                    schedule = JSON.parse(data)
                } catch (error) {
                    console.log("invaild data")
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
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
                    return;
                }
                let schedule = {
                    breaksPerSemester: [],
                    periodCount: 0,
                    sectionsPerSemester: [],
                    semesterCount: 0,
                };
                try {
                    schedule = JSON.parse(data);
                } catch (error) {
                    console.log("invaild data")
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}

export function saveTimeTableStructure(data, callBackFunction = () => { }) {
    console.log(JSON.stringify(data))
    let status;
    fetch(`${url}io/schedule/structure`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            status = response.status;
            return response.text();
        })
        .then((data) => {
            if (status !== 200) {
                return;
            }
            callBackFunction()
        });
}