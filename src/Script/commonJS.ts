import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

export function addWindowCloseEventHandler() { // function to check if current state is saved or not
    window.addEventListener("windowclose", () => { // windowclose event is only works on TTSBrowserComponent
        checkForSave(closeTheWindow)
    })
}

export function checkForSave(callBack = () => { }) {
    getCurrentFileIsSaved(async (isSaved) => { // api call
        if (!isSaved)
            if (window.confirm("You did't save the current state, Want to Save it now?")) { // if yes then save the current state
                getCurrentFileName(async fileName => saveCurrentState(fileName, callBack)) // api call
            } else callBack(); // if cancel then close the window
        else callBack(); // if it's already saved the close the window
    })
}

function closeTheWindow() {
    window.close();
}