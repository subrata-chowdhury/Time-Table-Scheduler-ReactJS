import React from 'react'
import "../Style/Confirm.css"
import { useConfirm } from './ConfirmContextProvider'

const Confirm: React.FC = () => {
    const { confirm, hideConfirm } = useConfirm();
    return (
        <>
            <div className={"confirm" + ` ${confirm.show ? "active" : ''}` + ` ${confirm.type}`}>
                <p>{confirm.message}</p>
                <div className='btns-container'>
                    <button className='approve' onClick={() => {
                        hideConfirm()
                        confirm.onApprove()
                    }}>Yes</button>
                    <button className='decline' onClick={() => {
                        hideConfirm()
                        confirm.onDecline()
                    }}>No</button>
                </div>
            </div>
            {confirm.show && <div className='confirm-background'></div>}
        </>
    )
}

export default Confirm