let url = window.location.origin + "/";

export function getCurrentFileName(callBackFunction) {
    try {
        let status;
        fetch(`${url}io/saves/currentName`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("Error in geting current state name", data)
                }
                callBackFunction(data);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}


export function saveCurrentStateInNewFile(name, callBackFunction = () => { }) {
    let status;
    try {
        fetch(`${url}io/saves/save?name=${name}`)
            .then((Response) => {
                status = Response.status;
                return Response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("Error in saving current state in new file", data)
                }
                alert(`Current State is Saved in ${name.toUpperCase()}`);
                callBackFunction();
            })
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}

export function getSaveFileList(callBackFunction) {
    let status;
    try {
        fetch(`${url}io/saves/list`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("Error in geting save sates list", data)
                }
                let files;
                try {
                    files = JSON.parse(data)
                } catch (error) {
                    console.log("invalid data")
                }
                callBackFunction(files);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}

export function loadSaveFile(name, callBackFunction = () => { }) {
    let status;
    try {
        fetch(`${url}io/saves/load?name=${name}`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("Error in loading " + name + "state", data)
                }
                alert("Opend Sucessfully")
                callBackFunction(data);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}

export function deleteFile(stateName, callBackFunction = () => { }) {
    let statusValue;
    try {
        fetch(url + "io/saves/delete?name=" + stateName, {
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
        console.log("Unale to Fetch Data")
    }
}