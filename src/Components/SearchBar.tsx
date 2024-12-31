import { memo, useCallback, useEffect, useRef, useState } from "react";
import Cross from "../Icons/Cross";
import Search from "../Icons/Search";
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
    onChange?: (filteredArray: string[], searchedValue?: string) => void,
    dontProccess?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ array = [], onChange = () => { }, dontProccess = false }) => {
    const [active, setActive] = useState(false);
    const [searchKey, setSearchKey] = useState("");

    const searchInputBox = useRef<HTMLInputElement>(null);

    const searchChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let searchKey = e.target.value.toUpperCase();
        setSearchKey(searchKey);
        if (dontProccess) {
            onChange([], searchKey)
            return
        }
        if (searchKey.length === 0) {
            onChange(array)
        } else {
            onChange(array.filter((item) => item.toUpperCase().indexOf(searchKey) !== -1))
        }
    }, [array, onChange])

    const searchIconClickHandler = useCallback(() => {
        if (searchInputBox.current != null) {
            setActive(true);
            searchInputBox.current.focus()
        }
    }, [searchInputBox, setActive])

    const crossIconClickHandler = useCallback(() => {
        setSearchKey("");
        onChange(array)
        setActive(false);
    }, [array, onChange])

    useEffect(() => {
        onChange(array)
    }, [array])

    return (
        <div className={"search-container" + (active ? " active" : "")}>
            <Search searchIconClickHandler={searchIconClickHandler} />
            <input className="search-input" placeholder="Search Name" value={searchKey} onChange={searchChangeHandler} ref={searchInputBox}></input>
            <Cross crossIconClickHandler={crossIconClickHandler} />
        </div>
    )
}

export default memo(SearchBar)