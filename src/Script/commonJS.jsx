import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

function windowcloseEventHandler() { // function to check if current state is saved or not
    window.addEventListener("windowclose", () => { // windowclose event is only works on TTSBrowserComponent
        checkCurrentStateIsSavedBeforeClose(closeTheWindow)
    })
}
windowcloseEventHandler()

export function checkCurrentStateIsSavedBeforeClose(callBackIfIsSavedOrCanceledOrAfterSaved = () => { }) {
    getCurrentFileIsSaved((isSaved) => { // api call
        if (!isSaved)
            if (window.confirm("You did't save the current state, Want to Save it now?")) { // if yes then save the current state
                getCurrentFileName((fileName) => { // api call
                    saveCurrentState(fileName, callBackIfIsSavedOrCanceledOrAfterSaved()) // api call
                })
            } else callBackIfIsSavedOrCanceledOrAfterSaved(); // if cancel then close the window
        else callBackIfIsSavedOrCanceledOrAfterSaved(); // if it's already saved the close the window
    })
}

function closeTheWindow() {
    window.close();
}