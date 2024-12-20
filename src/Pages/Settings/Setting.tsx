// @ts-nocheck
import React, { useEffect, useState } from 'react'
import '../../Style/Settings.css'

interface SettingProps {
    heading: string,
    description: string,
    type: 'checkbox' | 'text' | 'number' | 'select' | 'radio' | 'textarea',
    options?: Array<string>,
    value: string | number | boolean,
    onChange: (value: boolean) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    className?: string,
    error?: string
}

const Setting: React.FC<SettingProps> = ({
    heading = "",
    description = "",
    type = 'checkbox',
    options,
    value,
    onChange = () => { },
    onBlur = () => { },
    disabled,
    required,
    placeholder,
    className,
    error
}): JSX.Element => {
    return (
        <div className='setting'>
            <div className='header'>
                <div>{heading}</div>
                {
                    type === 'checkbox' ?
                        <Checkbox
                            value={Boolean(value)}
                            onChange={onChange}
                            onBlur={onBlur}
                            disabled={disabled}
                            required={required}
                            placeholder={placeholder}
                            className={className}
                            error={error}
                        />
                        :
                        ""
                }
            </div>
            {description && <div className='footer description'>{description}</div>}
        </div>
    )
}

interface CheckboxProps {
    value?: boolean,
    onChange: (value: boolean) => void,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    className?: string,
    error?: string
}

const Checkbox: React.FC<CheckboxProps> = ({
    value,
    onChange = () => { },
    onBlur = () => { },
    disabled,
    required,
    placeholder,
    className,
    error
}): JSX.Element => {
    const [isChecked, setIsChecked] = useState(value || false);

    useEffect(() => {
        setIsChecked(value)
    }, [value])

    const handleChange = () => {
        if (disabled) return;
        setIsChecked(!isChecked);
        onChange(!isChecked);
    }

    return (
        <div className={`setting-checkbox ${disabled ? 'disabled' : ''}`} onClick={handleChange}>
            <div className={`circle ${isChecked ? 'checked' : ''}`}></div>
        </div>
    )
}

export default Setting