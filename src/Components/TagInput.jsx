import { memo, useCallback, useEffect, useState } from "react";
import { hasElement } from "../Script/util";
import "../Style/Tags.css"

function TagInput({
    tagList = [],
    inputName = "",
    details,
    updateWithNewValues = () => { }
}) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        setTags(details[inputName])
    }, [details])

    const deleteTag = useCallback((event, tagIndex) => {
        event.preventDefault();
        let newTags = [...tags]
        newTags.splice(tagIndex, 1);
        setTags(newTags)
        updateWithNewValues(newTags)
    }, [tags])

    let tagElements = [];
    for (let index = 0; index < tags.length; index++) {
        tagElements.push(
            <Tag value={tags[index]} tagIndex={index} onClickHandler={deleteTag} key={index}></Tag>
        )
    }

    const inputBoxInputHandler = useCallback((event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let tagValue = event.target.value.trim().toUpperCase();
            if (tagList.length > 0)
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
    }, [tags, details])
    const updateTags = useCallback((event, tagValue) => {
        let newTags = [...tags];
        newTags.push(tagValue);
        setTags(newTags)
        updateWithNewValues(newTags)
        event.target.value = ""
    }, [tags])

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