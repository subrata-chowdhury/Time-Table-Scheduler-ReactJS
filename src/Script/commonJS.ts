import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

export function addWindowCloseEventHandler() { // function to check if current state is saved or not
    window.addEventListener("windowclose", () => { // windowclose event is only works on TTSBrowserComponent
        checkForSave(closeTheWindow)
    })
}

export function removeWindowCloseEventHandler() { // function to remove the windowclose event
    window.removeEventListener("windowclose", () => { })
}

export function checkForSave(callBack = () => { }) {
    getCurrentFileIsSaved(async (isSaved) => { // api call
        if (!isSaved)
            if (window.confirm("You did't save the current state, Want to Save it now?")) { // if yes then save the current state
                await getCurrentFileName(async fileName => saveCurrentState(fileName)) // api call
            }
        callBack()
    })
}

function closeTheWindow() {
    window.close();
}