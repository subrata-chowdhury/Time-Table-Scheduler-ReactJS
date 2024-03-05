let url = window.location.origin + "/";

export function getSubjectList(func) {
    let status;
    try {
        fetch(`${url}io/subjects`)
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((data) => {
                if (status !== 200) {
                    return;
                }
                let listArray = [];
                try {
                    listArray = JSON.parse(data);
                    func(listArray);
                } catch (error) {
                    console.log("data is invaild")
                }
            });
    } catch (error) {
        console.log("Unale to Fetch Data")
    }
}