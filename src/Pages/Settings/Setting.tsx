// @ts-nocheck
import React, { memo, useEffect, useState } from 'react'
import '../../Style/Settings.css'
import Arrow from '../../Icons/Arrow'

interface SettingProps {
    heading: string,
    description: string,
    type?: 'checkbox' | 'text' | 'number' | 'select' | 'radio' | 'textarea',
    options?: Array<string>,
    value: string | number | boolean,
    onChange: (value: string | boolean) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    className?: string,
    error?: string
    component?: React.ReactNode
}

const Setting: React.FC<SettingProps> = ({
    heading = "",
    description = "",
    type = '',
    options,
    value,
    onChange = () => { },
    onBlur = () => { },
    disabled,
    required,
    placeholder,
    className,
    error,
    component
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
                {
                    type === 'select' ?
                        <Dropdown
                            value={value as string}
                            options={options}
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
                {
                    component ? component : ""
                }
            </div>
            {description && <div className='footer description'>{description}</div>}
        </div>
    )
}

interface CheckboxProps extends commonInputProps {
    value?: boolean,
    onChange: (value: boolean) => void,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    className?: string,
    error?: string
}

const Checkbox: React.FC<CheckboxProps> = memo(({
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
})

interface DropdownProps {
    value: string,
    options: Array<string>,
    onChange: (value: string) => void,
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    className?: string,
    error?: string
}

export const Dropdown: React.FC<DropdownProps> = memo(({
    value,
    options,
    onChange = () => { },
    onBlur = () => { },
    disabled,
    required,
    placeholder,
    className,
    error
}): JSX.Element => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div
            className='setting-dropdown'
            style={{
                position: 'relative',
                cursor: 'pointer',
                border: '2px solid var(--borderColor)',
                borderRadius: 5,
                padding: '10px 0.7rem',
                color: 'var(--textColor)',
                backgroundColor: 'var(--containerColor)',
            }}
            onClick={() => setShowDropdown(!showDropdown)}>
            <div
                className='dropdown-header'
                style={{
                    display: 'flex',
                    gap: '0.4rem',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                <span className='selected' style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>{options.includes(value) ? value : "Select a Option"}</span>
                <Arrow arrowStyle={{
                    transform: showDropdown ? 'rotate(-90deg)' : 'rotate(90deg)',
                    width: '1rem',
                    height: '1rem',
                    transition: '0.3s',
                    fill: 'var(--textColor)'
                }} />
            </div>
            {showDropdown && <div
                className='dropdown-list'
                style={{
                    position: 'absolute',
                    background: 'var(--containerColor)',
                    width: '100%',
                    left: 0,
                    boxSizing: 'border-box',
                    zIndex: 2,
                    borderRadius: 5,
                    transform: 'translateY(10px)',
                    boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)',
                    paddingTop: '0.1rem',
                    paddingBottom: '0.4rem',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                {
                    options.map((option, index) => (
                        <div
                            key={index}
                            className='dropdown-item hoverBgEffect'
                            style={{
                                padding: '10px 0.7rem',
                            }}
                            onClick={() => {
                                onChange(option);
                            }}>{option}</div>
                    ))
                }
            </div>}
        </div>
    )
})

export default memo(Setting)