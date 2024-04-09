import { memo, useCallback } from "react";
import { hasElement } from "../Script/util";
import "../Style/Tags.css"

function TagInput({
    tagList,
    inputName = "",
    details,
    updateWithNewValues = () => { }
}) {
    const deleteTag = useCallback((event, tagIndex) => {
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

    const inputBoxInputHandler = useCallback((event) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
            event.preventDefault();
            let tagValue = event.target.value.trim().toUpperCase();
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
    const updateTags = useCallback((event, tagValue) => {
        let newTags = [...details[inputName]];
        newTags.push(tagValue);
        updateWithNewValues(newTags)
        event.target.value = ""
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

function Tag({ value, tagIndex, onClickHandler = () => { } }) {
    return (
        <div className="tag">
            <div>{value}</div>
            <button className="delete-tag-btn" onClick={event => onClickHandler(event, tagIndex)}>+</button>
        </div>
    )
}

export default memo(TagInput)