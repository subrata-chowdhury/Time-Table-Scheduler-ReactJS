import React from 'react'
import "../Style/Alert.css"
import { useAlert } from './AlertContextProvider'

interface AlertProps {
    onAlertClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ onAlertClose = () => { } }) => {
    const { alert, hideAlert } = useAlert();

    return (
        <div className={"alert" + ` ${alert.show ? "active" : ''}` + ` ${alert.type}`}>
            <p>{alert.message}</p>
            <span className='close' onClick={() => {
                hideAlert();
                onAlertClose();
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20L4 4.00003M20 4L4.00002 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </span>
        </div>
    )
}

export default Alert