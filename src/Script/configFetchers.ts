import { url, getApiToken } from "./fetchUrl";

const setConfig = async (key: string, value: any, onSuccess: () => void = () => { }, onFailed: () => void = () => { }) => {
    try {
        const response = await fetch(`${url}io/config/global/${key}`, {
            method: 'PUT',
            headers: {
                'Api-Token': await getApiToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
        });
        if (response.status === 200) {
            onSuccess();
        } else {
            onFailed();
        }
    } catch (error) {
        console.log('Unable to set config:', error);
        throw error;
    }
}

const getConfig = async (key: string, onSuccess: (data: any | null) => void = () => { }, onFailed: () => void = () => { }) => {
    try {
        const response = await fetch(`${url}io/config/global/${key}`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        const data = await response.json();
        if (response.status === 200) {
            onSuccess(data);
        } else {
            onFailed();
        }
    } catch (error) {
        console.log('Unable to get config:', error);
        throw error;
    }
}

const deleteConfig = async (key: string, onSuccess: () => void = () => { }, onFailed: () => void = () => { }) => {
    try {
        const response = await fetch(`${url}io/config/global/${key}`, {
            method: 'DELETE',
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            onSuccess();
        } else {
            onFailed();
        }
    } catch (error) {
        console.log('Unable to delete config:', error);
        throw error;
    }
}

export { setConfig, getConfig, deleteConfig }