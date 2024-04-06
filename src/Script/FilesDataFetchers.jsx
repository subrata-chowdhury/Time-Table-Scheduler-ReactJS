import { getApiToken, url } from "./fetchUrl"
export function getCurrentFileName(callBackFunction) {
    try {
        let status;
        fetch(`${url}io/saves/currentName`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting current state name:", "color: red;", data)
                    data = ""
                }
                callBackFunction(data);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Current File Name")
    }
}

export function getCurrentFileIsSaved(callBackFunction = () => { }) {
    let status;
    try {
        fetch(`${url}io/saves/isSaved`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then((Response) => {
                status = Response.status;
                return Response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting current state is saved or not:", "color: red;", data)
                    return
                }
                data = JSON.parse(data)
                callBackFunction(data);
            })
    } catch (error) {
        console.log("Unable to Fetch Data of Current File Save State")
    }
}

export function saveCurrentState(name, callBackFunction = () => { }) {
    let status;
    try {
        fetch(`${url}io/saves/save?name=${name}`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then((Response) => {
                status = Response.status;
                return Response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    alert("Someting went wrong")
                    console.log("%cError in saving current state in new file:", "color: orange;", data)
                    return
                }
                alert(`Current State is Saved in ${name.toUpperCase()}`);
                callBackFunction();
            })
    } catch (error) {
        console.log("Unable to Call Fetch of Save Current State")
    }
}

export function createNewFile(name, callBackFunction = () => { }) {
    let status;
    try {
        fetch(`${url}io/Saves/newEmpty?name=${name}`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then((Response) => {
                status = Response.status;
                return Response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log(`Request URL: %c${url}io/Saves/newEmpty?name=${name} \n%cError in creating a new file: `, "color: blue;", "color: orange;", data)
                    return
                }
                alert(`Created a new file called ${name.toUpperCase()}`);
                callBackFunction();
            })
    } catch (error) {
        console.log("Unable to Call Fetch of Create New File")
    }
}

export function getSaveFileList(callBackFunction = (data) => { }) {
    let status;
    try {
        fetch(`${url}io/saves/list`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log("%cError in getting save states list:", "color: red;", data)
                }
                let files = [];
                try {
                    files = JSON.parse(data)
                } catch (error) {
                    console.log("%cInvalid state list data", "color: orange;", data)
                }
                callBackFunction(files);
            });
    } catch (error) {
        console.log("Unable to Fetch Data of Save File List")
    }
}

export function loadSaveFile(name, callBackFunction = (data) => { }) {
    let status;
    try {
        fetch(`${url}io/saves/load?name=${name}`, {
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    console.log(`Request URL: %c${url}io/saves/load?name=${name} \n%cError in loading state`, "color: blue;", "color: red;", data)
                    return
                }
                alert("Opend Sucessfully")
                callBackFunction(data);
            });
    } catch (error) {
        console.log("Unable to Call Fetch of Load Saved File")
    }
}

export function deleteFile(name, callBackFunction = () => { }) {
    let statusValue;
    try {
        fetch(url + "io/saves/delete?name=" + name, {
            method: "DELETE",
            headers: {
                'Api-Token': getApiToken()
            }
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text()
            })
            .then(data => {
                if (statusValue !== 200) {
                    alert("Something went wrong");
                    console.log(`Request URL: %c${url}io/saves/delete?name=${name} %cError in Deleteing file`, "color: blue;", "color: yelow;", data)
                    return;
                }
                callBackFunction();
            })
    } catch (error) {
        console.log("Unable to Call Fetch of Delete File")
    }
}