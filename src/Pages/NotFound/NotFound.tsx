import React, { JSX } from 'react'

const NotFound: React.FC = (): JSX.Element => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1>404 - Not Found!</h1>
            <a href='/'>Go Home</a>
        </div>
    )
}

export default NotFound