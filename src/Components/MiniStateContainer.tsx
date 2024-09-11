import { memo, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers";
import "../Style/Mini-state-container.css";
import { checkForSave } from "../Script/commonJS";
import { useAlert } from "./AlertContextProvider";

interface MiniStateContainerProps {
    onChange?: () => void,
    forceReRenderer?: boolean
}

const MiniStateContainer: React.FC<MiniStateContainerProps> = ({ onChange = () => { }, forceReRenderer = false }) => {
    const [files, setFiles] = useState<string[]>([])

    const selectInput = useRef<HTMLSelectElement>(null)

    const { showSuccess } = useAlert();

    useEffect(() => {
        getSaveFileList(files => { // api call
            setFiles(files)
            getCurrentFileName(currentFileName => { // api call
                selectInput.current?.querySelectorAll("option").forEach((option) => {
                    if (option.value.toLowerCase() === currentFileName.toLowerCase()) {
                        option.selected = true
                    }
                })
            });
        });
    }, [forceReRenderer])

    const onChangeStateHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        checkForSave(() => {
            loadSaveFile(event.target.value, () => {
                showSuccess("File Loaded Successfully")
                onChange()
            }) // api call
        }) // api calls present in the function
    }, [])

    return (
        <div className="mini-states-container">
            <label>Current File:</label>
            <select className="state-selector" onChange={onChangeStateHandler} ref={selectInput}>
                {files && files.length > 0 && files.map((file: string, index: number) => (
                    <Option value={file} key={index}></Option>
                ))}
            </select>
        </div>
    )
}

interface OptionProps {
    value: string
}
const Option: React.FC<OptionProps> = ({ value }) => {
    return (
        <option value={value.toLowerCase()}>{value}</option>
    )
}

export default memo(MiniStateContainer)