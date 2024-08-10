import { memo, useCallback, useRef, useState } from "react";
import Cross from "../Icons/Cross.tsx";
import Search from "../Icons/Search.tsx";
import "../Style/SearchBar.css"

export function match(list: string[], key: string) {
    let res = []
    for (let i = 0; i < list.length; i++) {
        if (list[i].toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            res.push(i)
        }
    }
    return res
}

interface SearchBarProps {
    array: string[],
    onChange?: (filteredArray: string[]) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ array = [], onChange = () => { } }) => {
    const [active, setActive] = useState(false);
    const [searchKey, setSearchKey] = useState("");

    const searchInputBox = useRef<HTMLInputElement>(null);
    const searchInputContainer = useRef<HTMLDivElement>(null);

    const searchChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let searchKey = e.target.value.trim().toUpperCase();
        setSearchKey(searchKey);
        if (searchKey === "") {
            onChange(array)
        } else {
            onChange(array.filter((item) => item.toUpperCase().indexOf(searchKey) !== -1))
        }
    }, [array, onChange])

    const searchIconClickHandler = useCallback(() => {
        if (searchInputBox.current != null && searchInputContainer.current != null) {
            setActive(true);
            searchInputBox.current.focus()
        }
    }, [searchInputBox, searchInputContainer])

    const crossIconClickHandler = useCallback(() => {
        if (searchInputBox.current != null && searchInputContainer.current != null) {
            setSearchKey("");
            setActive(false);
        }
    }, [searchInputBox, searchInputContainer])

    return (
        <div className={"search-container" + (active ? " active" : "")} ref={searchInputContainer}>
            <Search searchIconClickHandler={searchIconClickHandler} />
            <input className="search-input" placeholder="Search Name" value={searchKey} onChange={searchChangeHandler} ref={searchInputBox}></input>
            <Cross crossIconClickHandler={crossIconClickHandler} />
        </div>
    )
}

export default memo(SearchBar)