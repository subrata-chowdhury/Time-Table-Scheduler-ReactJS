import { useState } from "react"
import "../Style/BasicComponents.css"

export function InputBox({ inputHeading = "Sample", type = "text", className = "", placeholder = "", readOnly = false, value = "", maxVlaue, minValue }) {
    const [inputBoxValue, setInputBoxValue] = useState(value)
    function handleOnchange(event) {
        setInputBoxValue(event.target.value)
    }
    return (
        <div className="input-container">
            <div className="input-box-heading">{inputHeading}</div>
            {
                type === "number" ?
                    <input type={"number"} className={className + " input-box"} placeholder={placeholder} readOnly={readOnly} value={inputBoxValue} max={maxVlaue} min={minValue} onChange={event => { handleOnchange(event) }}></input> :
                    <input type={type} className={className + " input-box"} placeholder={placeholder} readOnly={readOnly} value={inputBoxValue} onChange={event => { handleOnchange(event) }}></input>
            }
        </div>
    )
}