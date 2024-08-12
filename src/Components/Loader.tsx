import { memo } from "react";
import "../Style/Loader.css"

function Loader() {
    return (
        <div className='loader'>
            <div className='outer-circle'></div>
            <div className='inner-circle'></div>
        </div>
    )
}

export default memo(Loader);