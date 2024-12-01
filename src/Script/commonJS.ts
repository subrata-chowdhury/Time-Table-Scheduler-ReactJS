import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

export function addWindowCloseEventHandler(confirmPopup: (msg: string) => void, onFailed: (msg: string) => void) { // function to check if current state is saved or not
    window.addEventListener("windowclose", () => { // windowclose event is only works on TTSBrowserComponent
        checkForSave(closeTheWindow, confirmPopup, onFailed); // if not saved then show the confirm popup
    })
}

export function removeWindowCloseEventHandler() { // function to remove the windowclose event
    window.removeEventListener("windowclose", () => { });
}

export function checkForSave(callBack = () => { }, confirmPopup: (msg: string, onApprove: () => void, onDecline?: () => void) => void, onFailed: (msg: string) => void) {
    getCurrentFileIsSaved(async (isSaved) => { // api call
        if (!isSaved)
            confirmPopup("You did't save the current state, Want to Save it now?", async () => {
                await getCurrentFileName(async fileName => {
                    await saveCurrentState(fileName, closeTheWindow, onFailed);
                    callBack();
                }) // api call
            }, callBack) // if not saved then show the confirm popup
        else callBack();
    }, closeTheWindow)
}

function closeTheWindow() {
    window.close();
}