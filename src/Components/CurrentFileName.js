import { useEffect, useState } from "react"
import { getCurrentFileName } from "../Script/DataFetchers";

export default function CurrentState(){
    const [currentFileName, setCurrentFileName] = useState("An Error Occured");
    useEffect(()=>{
        getCurrentFileName(setCurrentFileName);
    },[currentFileName])
    return(
        <div className="current-state">Current File Name: {currentFileName}</div>
    )
}