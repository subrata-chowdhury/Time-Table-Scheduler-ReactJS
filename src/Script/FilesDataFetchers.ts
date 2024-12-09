import { getApiToken, url } from "./fetchUrl"
export const getCurrentFileName = async (onSuccess: (data: string) => void = () => { }): Promise<string> => {
    try {
        const response = await fetch(`${url}io/saves/currentName`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        const textResponse = await response.text();

        let data: string = "";
        if (response.status !== 200) {
            console.log("%cError in getting current state name:", "color: red;", textResponse);
        } else if (response.ok) {
            data = textResponse;
            onSuccess(data);
        }
        return data;
    } catch (error) {
        console.log("Unable to Fetch Data of Current File Name")
        throw error;
    }
}

export const getCurrentFileIsSaved = async (onSuccess: (data: boolean) => void = () => { }, onFailed: (msg?: string) => void): Promise<boolean> => {
    try {
        const response = await fetch(`${url}io/saves/isSaved`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        const data: boolean = await response.json();
        if (response.status !== 200) {
            const textResponse = await response.text() || String(data);
            console.log("%cError in getting current state is saved or not:", "color: red;", textResponse);
            onFailed(textResponse);
        } else if (response.ok) {
            onSuccess(data);
        }
        return data;
    } catch (error) {
        console.log("Unable to Fetch Data of Current File Save State");
        onFailed();
        throw error;
    }
}

export const saveCurrentState = async (name: string, onSuccess: () => void = () => { }, onFailed: (msg: string) => void): Promise<string> => {
    try {
        const response = await fetch(`${url}io/saves/save?name=${name}`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });

        const textResponse = await response.text();
        if (response.status === 200) {
            onSuccess();
        } else {
            onFailed(textResponse);
            console.log("%cError in saving current state in new file:", "color: orange;", textResponse);
        }
        return textResponse;
    } catch (error) {
        console.log("Unable to Call Fetch of Save Current State");
        throw error;
    }
}

export const createNewFile = async (name: string, onSuccess: () => void = () => { }): Promise<string> => {
    try {
        const response = await fetch(`${url}io/saves/newEmpty?name=${name}`, {
            method: 'POST',
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        const textResponse = await response.text();
        if (response.status === 200) {
            onSuccess();
        } else {
            console.log(`Request URL: %c${url}io/Saves/newEmpty?name=${name} \n%cError in creating a new file: `, "color: blue;", "color: orange;", textResponse);
        }
        return textResponse;
    } catch (error) {
        console.log("Unable to Call Fetch of Create New File");
        throw error;
    }
}

export const getSaveFileList = async (
    onSuccess: (data: string[]) => void = () => { },
    onFailed: (data: string[]) => void = () => { }
): Promise<string[]> => {
    try {
        const response = await fetch(`${url}io/saves/list`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        let files: string[] = [];
        if (response.status === 200) {
            try {
                files = await response.json();
            } catch (error) {
                console.log("%cInvalid state list data", "color: orange;", await response.text());
            }
            onSuccess(files);
            return files;
        } else {
            const serverResponse = await response.text();
            onFailed(files);
            console.log("%cError in getting save states list:", "color: red;", serverResponse);
            return [];
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Save File List");
        throw error;
    }
}

export const loadSaveFile = async (name: string, onSuccess: () => void = () => { }): Promise<string> => {
    try {
        const response = await fetch(`${url}io/saves/load?name=${name}`, {
            method: 'POST',
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        const textResponse = await response.text();
        if (response.status === 200) {
            onSuccess();
        } else {
            console.log(`Request URL: %c${url}io/saves/load?name=${name} \n%cError in loading state`, "color: blue;", "color: red;", textResponse);
        }
        return textResponse;
    } catch (error) {
        console.log("Unable to Call Fetch of Load Saved File");
        throw error;
    }
}

export const deleteFile = async (name: string, onSuccess: () => void = () => { }, onFailed: (msg?: string) => void = () => { }): Promise<string> => {
    try {
        const response = await fetch(url + "io/saves/delete?name=" + name, {
            method: "DELETE",
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        const textResponse = await response.text();
        if (response.status === 200) {
            onSuccess();
        } else {
            onFailed(textResponse);
            console.log(`Request URL: %c${url}io/saves/delete?name=${name} %cError in Deleteing file`, "color: blue;", "color: yelow;", textResponse);
        }
        return textResponse;
    } catch (error) {
        console.log("Unable to Call Fetch of Delete File");
        throw error;
    }
}