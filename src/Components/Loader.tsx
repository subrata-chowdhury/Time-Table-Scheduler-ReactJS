import { memo } from "react";
import "../Style/Loader.css"

function Loader({ display = false }) {
    let loaderDisplayStyle = {
        display: (display ? "block" : "none")
    }
    return (
        <div className='loader' style={loaderDisplayStyle}>
            <div className='outer-circle'></div>
            <div className='inner-circle'></div>
        </div>
    )
}

export default memo(Loader);