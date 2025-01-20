import React, { useState } from 'react'

type Props = {
    title: string | React.ReactNode,
    children: React.ReactNode,
    width?: number
}

const CustomTitle: React.FC<Props> = ({ title, width = 200, children }) => {
    const [showTitle, setShowTitle] = useState(false)

    return (
        <>
            <div onMouseEnter={() => setShowTitle(true)} onMouseLeave={() => setShowTitle(false)}>
                {children}
            </div>
            {
                showTitle &&
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -5, transform: 'translate(-50%,-100%)', background: 'var(--foregroudColor)', padding: 10, width: width, borderRadius: 8, fontSize: '0.8rem' }}>{title}</div>
                </div>
            }
        </>
    )
}

export default CustomTitle