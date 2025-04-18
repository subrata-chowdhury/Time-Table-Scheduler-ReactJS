import React from 'react'

const Sort: React.FC<{ size?: number, rotate?: number }> = ({ size = 20, rotate = 0 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size} height={size} fill='var(--textColor)' style={{ transform: `rotate(${rotate}deg)` }}
        >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M4 18h4c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm1 6h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1z" />
        </svg>

    )
}

export default Sort