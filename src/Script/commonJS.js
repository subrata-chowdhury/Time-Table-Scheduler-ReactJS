import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

function checkCurrentStateIsSavedBeforeClose(){
    window.addEventListener("windowclose", () => {
        getCurrentFileIsSaved((isSaved) => {
            if (!isSaved)
                if (window.confirm("You did't save the current state, Want to Save it now?")) {
                    getCurrentFileName((fileName) => {
                        saveCurrentState(fileName)
                    })
                } else closeTheWindow();
            else closeTheWindow();
            function closeTheWindow() {
                window.close();
            }
        })
    })
}
checkCurrentStateIsSavedBeforeClose()
