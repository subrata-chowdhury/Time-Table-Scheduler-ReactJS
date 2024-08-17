import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers';
export function addWindowCloseEventHandler() {
    window.addEventListener("windowclose", () => {
        checkForSave(closeTheWindow);
    });
}
export function removeWindowCloseEventHandler() {
    window.removeEventListener("windowclose", () => { });
}
export function checkForSave(callBack = () => { }) {
    getCurrentFileIsSaved(async (isSaved) => {
        if (!isSaved)
            if (window.confirm("You did't save the current state, Want to Save it now?")) { // if yes then save the current state
                await getCurrentFileName(async (fileName) => saveCurrentState(fileName)); // api call
            }
        callBack();
    });
}
function closeTheWindow() {
    window.close();
}
