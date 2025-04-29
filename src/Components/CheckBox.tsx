type Props = {
    label?: string,
    value: boolean,
    onChange: (val: boolean) => void,
    size?: number,
    disabled?: boolean,
    hideTick?: boolean,
}

const CheckBox = ({ label = '', value = true, onChange = () => { }, hideTick = false, disabled, size = 24 }: Props) => {
    return (
        <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            className={`checkbox ${value ? 'active' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => { if (!disabled) onChange(!value); }}
        >
            {!hideTick && !value && <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none">
                <path d="M19.25 3H5.75C4.50736 3 3.5 4.00736 3.5 5.25V18.75C3.5 19.9926 4.50736 21 5.75 21H19.25C20.4926 21 21.5 19.9926 21.5 18.75V5.25C21.5 4.00736 20.4926 3 19.25 3Z" stroke="#CED4DA" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>}
            {
                !hideTick && value && <div style={{ position: 'relative', color: "var(--accentColor)" }}>
                    <svg style={{ margin: 3 }} width="18" height="18" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
                        <path id="Vector" d="M16.25 0H2.75C1.50736 0 0.5 1.00736 0.5 2.25V15.75C0.5 16.9926 1.50736 18 2.75 18H16.25C17.4926 18 18.5 16.9926 18.5 15.75V2.25C18.5 1.00736 17.4926 0 16.25 0Z" fill="currentColor" />
                    </svg>

                    <svg style={{ position: 'absolute', top: 0, left: 0, margin: 4 }} width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Interface, Essential/Done, Check">
                            <g id="Group">
                                <g id="Group_2">
                                    <path id="Path" d="M13.8357 4.33203L6.50237 11.6654L3.16904 8.33203" stroke="white" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            }
            {label}
        </div>
    )
}

export default CheckBox