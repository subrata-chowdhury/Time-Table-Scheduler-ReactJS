import { memo, useCallback, useEffect, useRef, useState } from "react";
import { hasElement } from "../Script/util";
import "../Style/Tags.css";

const TagInput = ({ tagList = [], validTags = [], onChange = () => { } }) => {
    const [tag, setTag] = useState("");
    const [tagsList, setTagsList] = useState(tagList);

    const inputElem = useRef(null);

    useEffect(() => {
        setTagsList(tagList);
    }, [tagList]);

    const tagChangeHandler = useCallback((e) => {
        setTag(e.currentTarget.value.trim().toUpperCase());
    }, []);

    const addTag = useCallback(() => {
        if (tag === "" || tag.length === 0) {
            alert("Value can't be empty");
            return;
        }
        if (validTags.length > 0) {
            if (!hasElement(validTags, tag)) {
                alert("Value not valid");
                return;
            }
        }
        if (hasElement(tagList, tag)) {
            alert("Value already exists");
            return;
        }
        onChange([...tagList, tag]);
        setTagsList([...tagList, tag]);
        setTag("");
    }, [tag, tagList, validTags, onChange]);

    return (
        <div className='tag-input-container'>
            <div className='tags-container' onClick={event => {
                event.stopPropagation();
                inputElem.current?.focus();
            }}>
                {tagsList.map((tag, index) => (<Tag key={index} value={tag} onDeleteBtnClick={(e) => {
                    e.preventDefault();
                    console.log(tagList.filter(tagValue => tagValue !== tag));
                    onChange(tagList.filter(tagValue => tagValue !== tag));
                }} />))}
            </div>
            <input
                ref={inputElem}
                type="text"
                value={tag}
                onChange={tagChangeHandler}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                    }
                }} />
        </div>
    );
};

const Tag = ({ value, onDeleteBtnClick = () => { } }) => {
    return (
        <div className="tag">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1 }}>{value}</div>
            <button className="delete-tag-btn" onClick={onDeleteBtnClick}>+</button>
        </div>
    );
};

export default memo(TagInput);
