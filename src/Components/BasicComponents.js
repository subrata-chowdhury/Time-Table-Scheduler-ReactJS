import { useState } from "react"
import "../Style/BasicComponents.css"

export function InputBox({ inputHeading = "Sample", type = "text", className = "", placeholder = "", readOnly=false, value=""}){
    const [inputBoxValue, setInputBoxValue] = useState(value)
    function handleOnchange(event){
        setInputBoxValue(event.target.value)
    }
    return(
        <div className="input-container">
            <div className="input-box-heading">{inputHeading}</div>
            <input type={type} className={className + " input-box"} placeholder={placeholder} readOnly={readOnly} value={inputBoxValue} onChange={event => {handleOnchange(event)}}></input>
        </div>
    )
}