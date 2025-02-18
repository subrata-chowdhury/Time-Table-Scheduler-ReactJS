import React, { JSX } from "react"

interface ArrowWithLineProps {
    size?: number,
    rotate?: number,
}

const ArrowWithLine: React.FC<ArrowWithLineProps> = ({ size = 16, rotate = 0, ...props }): JSX.Element => {
    return (
        <svg
            height={size}
            viewBox="0 0 16 16"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${rotate}deg)` }}
            {...props}
        >
            <path
                d="M3.5 13h9a.75.75 0 01.102 1.493l-.102.007h-9a.75.75 0 01-.102-1.493L3.5 13h9zM7.898 1.007L8 1a.75.75 0 01.743.648l.007.102v7.688l2.255-2.254a.75.75 0 01.977-.072l.084.072a.75.75 0 01.072.977l-.072.084L8.53 11.78a.75.75 0 01-.976.073l-.084-.073-3.536-3.535a.75.75 0 01.977-1.133l.084.072L7.25 9.44V1.75a.75.75 0 01.648-.743L8 1z"
                fill="var(--textColor)"
            />
        </svg>
    )
}

export default ArrowWithLine
