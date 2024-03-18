import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

function checkCurrentStateIsSavedBeforeClose(){
    window.addEventListener("windowclose", () => {
        getCurrentFileIsSaved((isSaved) => {
            if (!isSaved)
                if (window.confirm("You did't save the current state, Want to Save it now?")) {
                    getCurrentFileName((fileName) => {
                        saveCurrentState(fileName, () => {
                            alert("Your current state is saved in " + fileName.toUpperCase())
                        })
                    })
                }
                else closeTheWindow();
            else closeTheWindow();
            function closeTheWindow() {
                window.close();
            }
        })
    })
}
checkCurrentStateIsSavedBeforeClose()
