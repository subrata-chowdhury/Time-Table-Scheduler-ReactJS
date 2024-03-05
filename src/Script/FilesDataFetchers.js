let url = window.location.origin + "/";

export function getCurrentFileName(func) {
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
                func(data);
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}