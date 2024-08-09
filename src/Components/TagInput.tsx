import { memo, useCallback } from "react";
import { hasElement } from "../Script/util.ts";
import "../Style/Tags.css"

interface TagInputProps {
    tagList: string[] | undefined,
    inputName?: string,
    details: { [key: string]: string[] },
    updateWithNewValues?: (newValues: string[]) => void
}

const TagInput: React.FC<TagInputProps> = ({
    tagList,
    inputName = "",
    details,
    updateWithNewValues = () => { }
}) => {
    const deleteTag = useCallback((event: React.MouseEvent<HTMLButtonElement>, tagIndex: number) => {
        event.preventDefault();
        let newTags = [...details[inputName]]
        newTags.splice(tagIndex, 1);
        updateWithNewValues(newTags)
    }, [details])

    let tagElements = [];
    for (let index = 0; index < details[inputName].length; index++) {
        tagElements.push(
            <Tag value={details[inputName][index]} tagIndex={index} onClickHandler={deleteTag} key={index}></Tag>
        )
    }

    const inputBoxInputHandler = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
            event.preventDefault();
            let tagValue = (event.target as HTMLInputElement).value.trim().toUpperCase();
            if (tagValue.length <= 0) {
                alert("Value can't be empty")
                return
            }
            if (Array.isArray(tagList))
                if (hasElement(tagList, tagValue)) {
                    if (hasElement(details[inputName], tagValue)) {
                        alert("Already Present");
                        return;
                    }
                    updateTags(event, tagValue)
                } else {
                    alert("Value does not exist")
                }
            else updateTags(event, tagValue)
        }
    }, [details[inputName], details])
    const updateTags = useCallback((event: React.KeyboardEvent<HTMLInputElement>, tagValue: string) => {
        let newTags = [...details[inputName]];
        newTags.push(tagValue);
        updateWithNewValues(newTags)
        event.currentTarget.value = ""
    }, [details])

    return (
        <div className='tag-input-container'>
            <div className='tags-container'>{tagElements}</div>
            <input
                type="text"
                name={inputName}
                onKeyDown={event => {
                    inputBoxInputHandler(event)
                }}
            ></input>
        </div>
    )
}

function Tag({ value, tagIndex, onClickHandler = () => { } }: { value: string, tagIndex: number, onClickHandler?: (event: React.MouseEvent<HTMLButtonElement>, tagIndex: number) => void }) {
    return (
        <div className="tag">
            <div>{value}</div>
            <button className="delete-tag-btn" onClick={event => onClickHandler(event, tagIndex)}>+</button>
        </div>
    )
}

export default memo(TagInput)