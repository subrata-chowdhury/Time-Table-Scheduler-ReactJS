import { getCurrentFileIsSaved, getCurrentFileName, saveCurrentState } from './FilesDataFetchers'

function checkCurrentStateIsSavedBeforeClose(){ // function to check if current state is saved or not
    window.addEventListener("windowclose", () => { // windowclose event is only works on TTSBrowserComponent
        getCurrentFileIsSaved((isSaved) => { // api call
            if (!isSaved)
                if (window.confirm("You did't save the current state, Want to Save it now?")) { // if yes then save the current state
                    getCurrentFileName((fileName) => { // api call
                        saveCurrentState(fileName) // api call
                    })
                } else closeTheWindow(); // if cancel then close the window
            else closeTheWindow(); // if it's already saved the close the window
            function closeTheWindow() {
                window.close();
            }
        })
    })
}
checkCurrentStateIsSavedBeforeClose()
