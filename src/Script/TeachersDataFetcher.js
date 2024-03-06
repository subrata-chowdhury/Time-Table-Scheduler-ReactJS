let url = window.location.origin + "/";

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
                    return;
                }
                let listArray;
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
                    return;
                }
                let teacherData;
                try {
                    teacherData = JSON.parse(data);
                } catch (error) {
                    console.log("data is invaild")
                }
                callBackFunction(teacherData);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
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
                    return;
                }
                let schedule;
                try {
                    schedule = JSON.parse(data);
                } catch (error) {
                    console.log("data is invaild")
                }
                callBackFunction(schedule);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}


export function saveTeacher(data, callBackFunction = () => { }) {
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
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("data is invaild")
    }
}



export function deleteTeacher(teacherName, callBackFunction = () => { }) {
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
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("unable to send request")
    }
}