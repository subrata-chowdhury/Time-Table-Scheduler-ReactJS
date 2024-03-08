// let url = "http://localhost:57679/"
import { url } from "./fetchUrl"
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
                let schedule;
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

export function saveTimeTableStructure(data) {
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
            // terrorbox(data)
        });
}