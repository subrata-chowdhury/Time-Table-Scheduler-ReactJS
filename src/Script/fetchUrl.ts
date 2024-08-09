declare global {
    interface Window {
        apiToken: string;
    }
}

export const url = window.location.origin + "/"; // based url to fetch data using rest api
export const getApiToken = async () => window.apiToken; // getter to get api token to access data usig api (only works on TTSBrowserComponent)
//using function not directly storing the token because token changes over time and we need the current value of it