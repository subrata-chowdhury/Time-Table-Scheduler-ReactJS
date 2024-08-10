import { memo, useCallback, useState } from "react";
import { hasElement } from "../Script/util.ts";
import "../Style/Tags.css"

interface TagInputProps {
    tagList: string[]
    validTags?: string[]
    onChange?: (newTags: string[]) => void
}

const TagInput: React.FC<TagInputProps> = ({
    tagList = [],
    validTags = [],
    onChange = () => { }
}) => {
    const [tag, setTag] = useState<string>("")

    const tagChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value.trim().toUpperCase())
    }, [])

    const addTag = useCallback(() => {
        if (tag !== "") {
            alert("Value can't be empty")
            return
        }
        if (validTags.length > 0) {
            if (!hasElement(validTags, tag)) {
                alert("Value not valid")
                return
            }
        }
        if (hasElement(tagList, tag)) {
            alert("Value already exists")
            return
        }
        onChange([...tagList, tag])
        setTag("")
    }, [tag, tagList, onChange])

    return (
        <div className='tag-input-container'>
            <div className='tags-container'>
                {tagList.map((tag, index) => (
                    <Tag
                        key={index}
                        value={tag}
                        onDeleteBtnClick={() => {
                            onChange(tagList.filter(tagValue => tagValue !== tag))
                        }}
                    />
                ))}</div>
            <input
                type="text"
                name={tag}
                onChange={tagChangeHandler}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        addTag()
                    }
                }}
            ></input>
        </div>
    )
}

interface TagProps {
    value: string
    onDeleteBtnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Tag: React.FC<TagProps> = ({ value, onDeleteBtnClick = () => { } }) => {
    return (
        <div className="tag">
            <div>{value}</div>
            <button className="delete-tag-btn" onClick={onDeleteBtnClick}>+</button>
        </div>
    )
}

export default memo(TagInput)