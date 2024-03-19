import { useRef } from "react";
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

export default function SearchBar() {
    const searchInputBox = useRef();
    function searchInputHandler() {
        let list = [];
        let dataCards = document.querySelectorAll(".card.data");
        dataCards.forEach((e) => {
            list.push(e.title);
            e.style.cssText = "display: none;";
        })
        let result = match(list, document.querySelector(".search-input").value.trim());
        result.forEach((e) => {
            dataCards[e].style.cssText = "display: grid;";
        })
    }

    function searchIconClickHandler() {
        document.querySelector(".search-container").classList.add("active");
        document.querySelector(".search-input").focus()
    }

    function crossIconClickHandler() {
        searchInputBox.current.value = "";
        document.querySelector(".search-container").classList.remove("active");
    }

    return (
        <div className="search-container">
            <Search searchIconClickHandler={searchIconClickHandler} />
            <input className="search-input" placeholder="Search Name" onInput={searchInputHandler} ref={searchInputBox}></input>
            <Cross crossIconClickHandler={crossIconClickHandler} />
        </div>
    )
}