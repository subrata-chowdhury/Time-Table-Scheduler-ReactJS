import { memo, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentFileName, getSaveFileList, loadSaveFile } from "../Script/FilesDataFetchers.ts";
import "../Style/Mini-state-container.css";
import { checkCurrentStateIsSavedBeforeClose } from "../Script/commonJS.ts";

interface MiniStateContainerProps {
    onChange?: () => void,
    forceReRenderer?: boolean
}

const MiniStateContainer: React.FC<MiniStateContainerProps> = ({ onChange = () => { }, forceReRenderer = false }) => {
    const [files, setFiles] = useState<string[]>([])

    const selectInput = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        getSaveFileList(files => { // api call
            setFiles(files)
            getCurrentFileName(currentFileName => { // api call
                selectInput.current?.querySelectorAll("option").forEach((option) => {
                    if (option.value === currentFileName.toLowerCase()) {
                        option.selected = true
                    }
                })
            });
        });
    }, [forceReRenderer])

    const onChangeStateHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        checkCurrentStateIsSavedBeforeClose(() => {
            loadSaveFile(event.target.value, () => {
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