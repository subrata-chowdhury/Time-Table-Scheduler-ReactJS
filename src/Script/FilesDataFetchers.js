import { getApiToken, url } from "./fetchUrl";
export const getCurrentFileName = async (onSuccess = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(`${url}io/saves/currentName`, {
            headers: {
                'Api-Token': apiToken
            }
        });
        let textResponse = await response.text();
        let data = "";
        if (response.status !== 200) {
            console.log("%cError in getting current state name:", "color: red;", textResponse);
        }
        else if (response.ok) {
            data = textResponse;
            onSuccess(data);
        }
        return data;
    }
    catch (error) {
        console.log("Unable to Fetch Data of Current File Name");
        throw error;
    }
};
export const getCurrentFileIsSaved = async (onSuccess = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(`${url}io/saves/isSaved`, {
            headers: {
                'Api-Token': apiToken
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            console.log("%cError in getting current state is saved or not:", "color: red;", await response.text());
            window.close();
        }
        else if (response.ok) {
            onSuccess(data);
        }
        return data;
    }
    catch (error) {
        console.log("Unable to Fetch Data of Current File Save State");
        window.close();
        throw error;
    }
};
export const saveCurrentState = async (name, onSuccess = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(`${url}io/saves/save?name=${name}`, {
            headers: {
                'Api-Token': apiToken
            }
        });
        if (response.status === 200) {
            alert(`Current State is Saved in ${name.toUpperCase()}`);
            onSuccess();
        }
        else {
            alert("Someting went wrong");
            console.log("%cError in saving current state in new file:", "color: orange;", await response.text());
        }
        return await response.text();
    }
    catch (error) {
        console.log("Unable to Call Fetch of Save Current State");
        throw error;
    }
};
export const createNewFile = async (name, onSuccess = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(`${url}io/saves/newEmpty?name=${name}`, {
            method: 'POST',
            headers: {
                'Api-Token': apiToken
            }
        });
        if (response.status === 200) {
            alert(`Created a new file called ${name.toUpperCase()}`);
            onSuccess();
        }
        else {
            console.log(`Request URL: %c${url}io/Saves/newEmpty?name=${name} \n%cError in creating a new file: `, "color: blue;", "color: orange;", await response.text());
        }
        return await response.text();
    }
    catch (error) {
        console.log("Unable to Call Fetch of Create New File");
        throw error;
    }
};
export const getSaveFileList = async (onSuccess = () => { }, onFailed = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(`${url}io/saves/list`, {
            headers: {
                'Api-Token': apiToken
            }
        });
        let files = [];
        if (response.status === 200) {
            try {
                files = await response.json();
            }
            catch (error) {
                console.log("%cInvalid state list data", "color: orange;", await response.text());
            }
            onSuccess(files);
            return files;
        }
        else {
            const serverResponse = await response.text();
            onFailed(files);
            console.log("%cError in getting save states list:", "color: red;", serverResponse);
            return [];
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of Save File List");
        throw error;
    }
};
export const loadSaveFile = async (name, onSuccess = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(`${url}io/saves/load?name=${name}`, {
            method: 'POST',
            headers: {
                'Api-Token': apiToken
            }
        });
        if (response.status === 200) {
            alert("Opend Sucessfully");
            onSuccess();
        }
        else {
            console.log(`Request URL: %c${url}io/saves/load?name=${name} \n%cError in loading state`, "color: blue;", "color: red;", await response.text());
        }
        return await response.text();
    }
    catch (error) {
        console.log("Unable to Call Fetch of Load Saved File");
        throw error;
    }
};
export const deleteFile = async (name, onSuccess = () => { }) => {
    try {
        let apiToken = await getApiToken();
        let response = await fetch(url + "io/saves/delete?name=" + name, {
            method: "DELETE",
            headers: {
                'Api-Token': apiToken
            }
        });
        if (response.status === 200) {
            onSuccess();
        }
        else {
            alert("Something went wrong");
            console.log(`Request URL: %c${url}io/saves/delete?name=${name} %cError in Deleteing file`, "color: blue;", "color: yelow;", await response.text());
        }
        return await response.text();
    }
    catch (error) {
        console.log("Unable to Call Fetch of Delete File");
        throw error;
    }
};
