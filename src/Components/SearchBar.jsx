import { memo, useCallback, useRef } from "react";
import Cross from "../Icons/Cross";
import Search from "../Icons/Search";
import "../Style/SearchBar.css"

export function match(list, key) {
    let res = []
    for (let i = 0; i < list.length; i++) {
        if (list[i].toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            res.push(i)
        }
    }
    return res
}

function SearchBar() {
    const searchInputBox = useRef();
    const searchInputContainer = useRef();
    const dataCards = useRef();
    const searchInputHandler = useCallback(() => {
        let list = [];
        if (!dataCards.current)
            dataCards.current = document.querySelector(".cards-container").querySelectorAll(".card.data");
        dataCards.current.forEach((e) => {
            list.push(e.title);
            e.style.cssText = "display: none;";
        })
        let result = match(list, searchInputBox.current.value.trim());
        result.forEach((e) => {
            dataCards.current[e].style.cssText = "display: grid;";
        })
    }, [])

    const searchIconClickHandler = useCallback(() => {
        searchInputContainer.current.classList.add("active");
        searchInputBox.current.focus()
    }, [])

    const crossIconClickHandler = useCallback(() => {
        searchInputBox.current.value = "";
        searchInputContainer.current.classList.remove("active");
        searchInputHandler()
    }, [])

    return (
        <div className="search-container" ref={searchInputContainer}>
            <Search searchIconClickHandler={searchIconClickHandler} />
            <input className="search-input" placeholder="Search Name" onInput={searchInputHandler} ref={searchInputBox}></input>
            <Cross crossIconClickHandler={crossIconClickHandler} />
        </div>
    )
}

export default memo(SearchBar)