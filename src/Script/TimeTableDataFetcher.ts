import { FullTimeTable, TimeTable, TimeTableStructure } from "../data/Types";
import { getApiToken, url } from "./fetchUrl"

export const generateTimeTable = async (
    onSuccess: (data: FullTimeTable) => void = () => { },
    onFailed: (msg?: string) => void = () => { }
): Promise<FullTimeTable | []> => {
    try {
        const response = await fetch(`${url}io/schedule?generateNew=True`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let data;
            try {
                data = await response.json();
                onSuccess(data);
                return data;
            } catch (error) {
                console.log("%cInvalid Time Table Data", "color: orange", await response.text());
                return [];
            }
        } else {
            const textResponse = await response.text();
            onFailed("Failed to generate beacause: " + textResponse);
            console.log("%cError in generating Time Table", "color: orange;", textResponse);
            return [];
        }
    } catch (error) {
        console.log("Unable to call Fetch of Generate Time Table");
        throw error;
    }
}

export const getSchedule = async (onSuccess: (data: FullTimeTable) => void = () => { }): Promise<FullTimeTable | []> => {
    try {
        const response = await fetch(`${url}io/schedule`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let schedule;
            try {
                schedule = await response.json();
            } catch (error) {
                console.log("%cInvaild schedule data", "color: red;", await response.text());
            }
            onSuccess(schedule);
            return schedule;
        } else {
            console.log("%cError in getting schedule data", "color: orange;", await response.text());
            return [];
        }
    } catch (error) {
        console.log("Unable to Fetch Schedule Data");
        throw error;
    }
}

export const saveSchedule = async (
    sem: number,
    sec: number,
    timeTableData: TimeTable,
    onSuccess: (data: TimeTable) => void = () => { },
    onFailed: (msg?: string) => void = () => { }
): Promise<TimeTable | null> => {
    try {
        const response = await fetch(`${url}io/schedule?year=${sem}&sec=${sec}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': await getApiToken()
            },
            body: JSON.stringify(timeTableData)
        });
        if (response.status === 200) {
            onSuccess(timeTableData);
            return timeTableData;
        } else {
            const textResponse = await response.text();
            console.log("%cError in saving schedule data", "color: orange;", textResponse);
            console.log(timeTableData);
            onFailed(textResponse);
            return null;
        }
    } catch (error) {
        console.log("Unable to call Fetch of Save Schedule Data");
        throw error;
    }
}

export const getTimeTableStructure = async (onSuccess: (data: TimeTableStructure) => void = () => { }): Promise<TimeTableStructure | []> => {
    try {
        const response = await fetch(`${url}io/schedule/structure`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let schedule;
            try {
                schedule = await response.json();
            } catch (error) {
                console.log("%cInvaild data of time table structure", "color: red;", await response.text());
            }
            onSuccess(schedule);
            return schedule;
        } else {
            console.log("%cError in fetching time table structure", "color: red;", await response.text());
            return [];
        }
    } catch (error) {
        console.log("Unable to Fetch Data of Time table structure");
        throw error;
    }
}

export const saveTimeTableStructure = async (timeTableStructure: TimeTableStructure, onSuccess: () => void = () => { }, onFailed: (msg?: string) => void = () => { }): Promise<string> => {
    try {
        const response = await fetch(`${url}io/schedule/structure`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': await getApiToken()
            },
            body: JSON.stringify(timeTableStructure)
        });
        const textResponse = await response.text();
        if (response.status === 200) {
            onSuccess();
        } else {
            console.log("%cError in saving time table structure data", "color: orange;", textResponse);
            onFailed(textResponse);
        }
        return textResponse;
    } catch (error) {
        console.log("%cTime table structure data is invaild or %cUnable to call Fetch", "color: red;", "color: orange;", timeTableStructure);
        throw error;
    }
}