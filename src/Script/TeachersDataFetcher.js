import { getApiToken, url } from "./fetchUrl";
export const getTeachersList = async (onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(`${url}io/teachers/names`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        let listArray = [];
        if (response.status === 200) {
            try {
                listArray = await response.json();
            }
            catch (error) {
                console.log("%cTeacher list data is invaild", "color: orange;", await response.text());
            }
            onSuccess(listArray);
            return listArray;
        }
        else {
            onFailed([]);
            console.log("%cError in getting teacher list", "color: orange", await response.text());
            return [];
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of Teachers List");
        throw error;
    }
};
export const getTeachersDetailsList = async (onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(`${url}io/teachers`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        let listArray = [];
        if (response.status === 200) {
            try {
                listArray = await response.json();
            }
            catch (error) {
                console.log("%cTeacher list data is invaild", "color: orange;", await response.text());
            }
            onSuccess(listArray);
            return listArray;
        }
        else {
            onFailed([]);
            console.log("%cError in getting teacher list", "color: orange", await response.text());
            return [];
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of Teachers List");
        throw error;
    }
};
export const getTeacher = async (sirName, onSuccess = () => { }) => {
    try {
        const response = await fetch(`${url}io/teachers/${sirName}`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let teacherData;
            try {
                teacherData = await response.json();
            }
            catch (error) {
                console.log("%cTeacher details data is invaild", "color: red;", await response.text());
            }
            onSuccess(teacherData);
            return teacherData;
        }
        else {
            console.log(`Request URL: %c${url}io/teachers/${sirName} \n%cError in getting teacher details`, "color: blue;", "color: orange;", await response.text());
            return null;
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of Teacher Details");
        throw error;
    }
};
export const getTeacherSchedule = async (sirName, onSuccess = () => { }) => {
    try {
        const response = await fetch(`${url}io/schedule/teacher/${sirName}`, {
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            let schedule;
            try {
                schedule = await response.json();
            }
            catch (error) {
                console.log("%cTeacher schedule data is invaild", "color: orange;", await response.text());
            }
            onSuccess(schedule);
            return schedule;
        }
        else {
            console.log(`Request URL: %c${url}io/schedule/teacher/${sirName} \n%cError in getting teacher schedule`, "color: blue;", "color: orange;", await response.text());
            return null;
        }
    }
    catch (error) {
        console.log("Unable to Fetch Data of Teacher Schedule");
        throw error;
    }
};
export const saveTeacher = async (teacherName, teacherData, onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(url + `io/teachers/${teacherName}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'Api-Token': await getApiToken()
            },
            body: JSON.stringify(teacherData)
        });
        if (response.status === 200) {
            onSuccess();
            return await response.text();
        }
        else {
            console.log("%cError in Saving teacher details", "color: orange;", await response.text());
            onFailed();
            return null;
        }
    }
    catch (error) {
        console.log("%cTeacher details data is invaild or %cUnable to call Fetch", "color: red;", "color: orange;", teacherData);
        throw error;
    }
};
export const deleteTeacher = async (teacherName, onSuccess = () => { }, onFailed = () => { }) => {
    try {
        const response = await fetch(url + "io/teachers/" + teacherName, {
            method: "DELETE",
            headers: {
                'Api-Token': await getApiToken()
            }
        });
        if (response.status === 200) {
            onSuccess();
            return await response.text();
        }
        else {
            console.log(`Request URL: %c${url}io/teachers/${teacherName} %cUnable to delete teacher`, "color: blue;", "color: orange;", await response.text());
            onFailed();
            return null;
        }
    }
    catch (error) {
        console.log("unable to send request of teacher deletion");
        throw error;
    }
};
