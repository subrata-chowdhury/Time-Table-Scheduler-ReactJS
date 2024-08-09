import { memo, useCallback, useRef } from "react";
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

function SearchBar() {
    const searchInputBox = useRef<HTMLInputElement>(null);
    const searchInputContainer = useRef<HTMLDivElement>(null);
    const dataCards = useRef<NodeListOf<Element>>();
    const searchInputHandler = useCallback(() => {
        let list: string[] = [];
        if (!dataCards.current) {
            const cardsContainer = document.querySelector(".cards-container")
            if (cardsContainer)
                dataCards.current = cardsContainer.querySelectorAll(".card.data");
        }
        if (dataCards.current)
            dataCards.current.forEach((e) => {
                const element = e as HTMLElement;
                list.push(element.title);
                element.style.cssText = "display: none;";
            })
        let result;
        if (searchInputBox.current)
            result = match(list, searchInputBox.current.value.trim());
        if (result)
            result.forEach((e) => {
                if (dataCards.current)
                    (dataCards.current[e] as HTMLDivElement).style.cssText = "display: grid;";
            })
    }, [])

    const searchIconClickHandler = useCallback(() => {
        if (searchInputBox.current != null && searchInputContainer.current != null) {
            searchInputContainer.current.classList.add("active");
            searchInputBox.current.focus()
        }
    }, [])

    const crossIconClickHandler = useCallback(() => {
        if (searchInputBox.current != null && searchInputContainer.current != null) {
            searchInputBox.current.value = "";
            searchInputContainer.current.classList.remove("active");
            searchInputHandler()
        }
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