import { useEffect, useState } from "react";
import { hasElement } from "../Script/util";
import "../Style/Tags.css"

export function TagInput({
    tagList = ["A", "B"],
    inputName = "",
    teacherDetails,
    updateWithNewValues = () => { }
}) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        setTags(teacherDetails[inputName])
    }, [teacherDetails])

    let tagElements = [];
    for (let index = 0; index < tags.length; index++) {
        tagElements.push(
            <Tag value={tags[index]} tagIndex={index} key={index}></Tag>
        )
    }

    function inputBoxInputHandler(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            let tagValue = event.target.value.trim().toUpperCase()
            if (hasElement(tagList, tagValue)) {
                if (hasElement(teacherDetails[inputName], tagValue)) {
                    alert("Already Present");
                    return;
                }
                let newTags = [...tags];
                newTags.push(tagValue);
                setTags(newTags)
                updateWithNewValues(newTags)
                event.target.value = ""
            } else {
                alert("Value does not exist")
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