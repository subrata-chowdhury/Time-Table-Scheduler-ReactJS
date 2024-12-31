import React from 'react'

const ArrowFilled: React.FC<{ size?: number, rotate?: number, style?: React.CSSProperties }> = ({ size = 20, rotate = 0, style = {} }) => {
    return (
        <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill='var(--textColor)' style={{ transform: `rotate(${rotate}deg)`, ...style }}>
            <path d="m41 288h238c21.4 0 32.1 25.9 17 41l-119 119c-9.4 9.4-24.6 9.4-33.9 0l-119.1-119c-15.1-15.1-4.4-41 17-41z" />
        </svg>
    )
}

export default ArrowFilled