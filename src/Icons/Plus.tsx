import React from 'react'

const Plus: React.FC<{ size?: number }> = ({ size = 32 }) => {
    return (
        <svg height={size} id="Layer_1" version="1.1" viewBox="0 0 32 32" width={size} xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" style={{ fill: 'var(--textColor)' }}>
            <path d="M28,14H18V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v10H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h10v10c0,1.104,0.896,2,2,2  s2-0.896,2-2V18h10c1.104,0,2-0.896,2-2S29.104,14,28,14z" />
        </svg>
    )
}

export default Plus