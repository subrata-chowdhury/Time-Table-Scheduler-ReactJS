import { memo } from "react"
import "../Style/OwnerFooter.css"

function OwnerFooter() {
    return (
        <footer className='owner-text bottom-sub-container'>
            Created by <a href="https://github.com/Super7000">Subrata Chowdhury</a> &  <a href="https://github.com/srideep-banerjee">Srideep Banerjee</a> || All @Copyrights reserved
        </footer>
    )
}

export default memo(OwnerFooter)