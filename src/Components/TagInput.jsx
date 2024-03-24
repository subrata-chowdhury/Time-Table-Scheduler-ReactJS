import { useEffect, useState } from "react";
import { hasElement } from "../Script/util";
import "../Style/Tags.css"

export function TagInput({
    tagList = [],
    inputName = "",
    details,
    updateWithNewValues = () => { }
}) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        setTags(details[inputName])
    }, [details])

    let tagElements = [];
    for (let index = 0; index < tags.length; index++) {
        tagElements.push(
            <Tag value={tags[index]} tagIndex={index} key={index}></Tag>
        )
    }

    function inputBoxInputHandler(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            let tagValue = event.target.value.trim().toUpperCase();
            if (tagList.length > 0)
                if (hasElement(tagList, tagValue)) {
                    if (hasElement(details[inputName], tagValue)) {
                        alert("Already Present");
                        return;
                    }
                    updateTags()
                } else {
                    alert("Value does not exist")
                }
            else updateTags()
            function updateTags() {
                let newTags = [...tags];
                newTags.push(tagValue);
                setTags(newTags)
                updateWithNewValues(newTags)
                event.target.value = ""
            }
        }
    }

    function deleteTag(event, tagIndex) {
        event.preventDefault();
        let newTags = [...tags]
        newTags.splice(tagIndex, 1);
        setTags(newTags)
        updateWithNewValues(newTags)
    }

    function Tag({ value, tagIndex }) {
        return (
            <div className="tag">
                <div>{value}</div>
                <button className="delete-tag-btn" onClick={event => deleteTag(event, tagIndex)}>+</button>
            </div>
        )
    }
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