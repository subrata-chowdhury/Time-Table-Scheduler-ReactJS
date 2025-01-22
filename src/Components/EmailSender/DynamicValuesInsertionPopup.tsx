import { memo } from "react"

type DynamicValuePopupProps = {
    height?: number
    onClick: (value: string) => void
    onClose: () => void
}

const DynamicValuePopup: React.FC<DynamicValuePopupProps> = ({ height, onClick = () => { }, onClose = () => { } }) => {
    return (
        <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' }} onClick={onClose}></div>
            <div style={{ position: 'absolute', top: 5, left: 5, padding: 10, zIndex: 10, borderRadius: 8, background: 'var(--foregroudColor)', display: 'flex', flexDirection: 'column', gap: 2, height: height ? height : '', overflowY: 'auto' }}>
                {
                    ['name', 'rollNo', 'email', 'attendance', 'semester', 'section', 'phoneNumbers', 'address', 'date'].map(value => (
                        <div
                            style={{ padding: '5px 8px', borderRadius: 5, cursor: 'pointer' }}
                            className="hoverBgEffect"
                            key={value}
                            onClick={() => onClick(value)}>
                            @{value}
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default memo(DynamicValuePopup)