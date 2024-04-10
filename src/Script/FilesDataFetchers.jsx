import { getApiToken, url } from "./fetchUrl"
export async function getCurrentFileName(callBackFunction) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/saves/currentName`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        let textResponse = await response.text()
        let data = ""
        if (response.status !== 200) {
            console.log("%cError in getting current state name:", "color: red;", textResponse)
        } else {
            data = textResponse
        }
        callBackFunction(data);
    } catch (error) {
        console.log("Unable to Fetch Data of Current File Name")
    }
}

export async function getCurrentFileIsSaved(callBackFunction = () => { }) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/saves/isSaved`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status !== 200) {
            console.log("%cError in getting current state is saved or not:", "color: red;", await response.text())
            window.close();
            return
        }
        callBackFunction(await response.json());
    } catch (error) {
        console.log("Unable to Fetch Data of Current File Save State")
        window.close()
    }
}

export async function saveCurrentState(name, callBackFunction = () => { }) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/saves/save?name=${name}`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            alert(`Current State is Saved in ${name.toUpperCase()}`);
            callBackFunction();
        } else {
            alert("Someting went wrong")
            console.log("%cError in saving current state in new file:", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Call Fetch of Save Current State")
    }
}

export async function createNewFile(name, callBackFunction = () => { }) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/saves/newEmpty?name=${name}`, {
            method: 'POST',
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            alert(`Created a new file called ${name.toUpperCase()}`);
            callBackFunction();
        } else {
            console.log(`Request URL: %c${url}io/Saves/newEmpty?name=${name} \n%cError in creating a new file: `, "color: blue;", "color: orange;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Call Fetch of Create New File")
    }
}

export async function getSaveFileList(callBackFunction = (data) => { }) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/saves/list`, {
            headers: {
                'Api-Token': apiToken
            }
        })
        let files = [];
        if (response.status === 200) {
            try {
                files = await response.json()
            } catch (error) {
                console.log("%cInvalid state list data", "color: orange;", await response.text())
            }
            callBackFunction(files);
        } else {
            callBackFunction(files)
            console.log(apiToken)
            console.log("%cError in getting save states list:", "color: red;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Save File List")
    }
}

export async function loadSaveFile(name, callBackFunction = (data) => { }) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(`${url}io/saves/load?name=${name}`, {
            method: 'POST',
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            alert("Opend Sucessfully")
            callBackFunction(await response.text());
        } else {
            console.log(`Request URL: %c${url}io/saves/load?name=${name} \n%cError in loading state`, "color: blue;", "color: red;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Call Fetch of Load Saved File")
    }
}

export async function deleteFile(name, callBackFunction = () => { }) {
    try {
        let apiToken = await getApiToken()
        let response = await fetch(url + "io/saves/delete?name=" + name, {
            method: "DELETE",
            headers: {
                'Api-Token': apiToken
            }
        })
        if (response.status === 200) {
            callBackFunction();
        } else {
            alert("Something went wrong");
            console.log(`Request URL: %c${url}io/saves/delete?name=${name} %cError in Deleteing file`, "color: blue;", "color: yelow;", await response.text())
        }
    } catch (error) {
        console.log("Unable to Call Fetch of Delete File")
    }
}