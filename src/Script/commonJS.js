import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers';
export function addWindowCloseEventHandler(confirmPopup, onFailed) {
    window.addEventListener("windowclose", () => {
        checkForSave(closeTheWindow, confirmPopup, onFailed); // if not saved then show the confirm popup
    });
}
export function removeWindowCloseEventHandler() {
    window.removeEventListener("windowclose", () => { });
}
export function checkForSave(callBack = () => { }, confirmPopup, onFailed) {
    getCurrentFileIsSaved(async (isSaved) => {
        if (!isSaved)
            confirmPopup("You did't save the current state, Want to Save it now?", async () => {
                await getCurrentFileName(async (fileName) => {
                    await saveCurrentState(fileName, closeTheWindow, onFailed);
                    callBack();
                }); // api call
            }, callBack); // if not saved then show the confirm popup
        else
            callBack();
    }, closeTheWindow);
}
function closeTheWindow() {
    window.close();
}
