import { memo, useEffect, useRef, useState } from "react";
import { Email } from "../../data/Types";
import CustomTitle from "../CustomTitle";
import Question from "../../Icons/Question";
import DynamicValuePopup from "./DynamicValuesInsertionPopup";

type EmailConfigFormProps = {
    values: Email,
    onSave: (values: Email) => void,
    onEmailBodyChange?: (values: Email) => void,
    onCancel: () => void
}

const EmailConfigForm: React.FC<EmailConfigFormProps> = memo(({ values, onSave = () => { }, onEmailBodyChange = () => { }, onCancel = () => { } }) => {
    const [emailBody, setEmailBody] = useState<Email>({
        subject: "",
        heading: "",
        message: "",
        footer: ""
    })
    const [showPopup, setShowPopup] = useState<'message' | 'footer' | null>(null);
    const messageInput = useRef<HTMLTextAreaElement | null>(null);
    const footerInput = useRef<HTMLTextAreaElement | null>(null);
    const cursorPosition = useRef({
        selectionStart: 0,
        selectionEnd: 0
    })

    useEffect(() => {
        const formattedMsg = values.message.replace(/<br\/>/g, '\n');
        const formattedFooter = values.footer.replace(/<br\/>/g, '\n');
        setEmailBody({ ...values, message: formattedMsg, footer: formattedFooter });
    }, [values])

    function onChange(newValues: Email) {
        setEmailBody(newValues);
        onEmailBodyChange(newValues);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem' }}>
                <div className="input-container">
                    <div className="input-box-heading">Subject</div>
                    <input
                        type="text"
                        className="input-box"
                        style={{ fontSize: '0.9rem' }}
                        name='subject'
                        value={emailBody.subject}
                        placeholder='Subject of the Email'
                        onChange={e => onChange({ ...emailBody, subject: e.target.value })} />
                </div>
                <div className="input-container">
                    <div className="input-box-heading">Heading</div>
                    <input
                        type="text"
                        className="input-box"
                        style={{ fontSize: '0.9rem' }}
                        name='heading'
                        value={emailBody.heading}
                        placeholder='Heading'
                        onChange={e => onChange({ ...emailBody, heading: e.target.value })}></input>
                </div>
                <div className="input-container">
                    <div style={{ display: 'flex', gap: 8, alignContent: 'center' }}>
                        <div className="input-box-heading">Message</div>
                        <CustomTitle containerStyle={{ display: 'flex' }} width={250} title={<div><b>HTML can be included</b> in this field.<br /> Include images using {'<img src=""/>'} tag.<br /> Example: {'<b>'}For Bold{'</b>'}. <br />Use <b>@</b> to add student data. <br />Example: @name - @rollNo</div>}>
                            <div style={{ marginTop: 'auto', height: 19 }}>
                                <Question size={16} />
                            </div>
                        </CustomTitle>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            className="input-box"
                            ref={messageInput}
                            style={{ fontFamily: 'sans-serif', resize: 'vertical', fontSize: '0.9rem' }}
                            name='message'
                            rows={6}
                            value={emailBody.message}
                            placeholder='Message'
                            onKeyDown={e => {
                                if (e.key === '@') {
                                    setShowPopup('message');
                                    messageInput.current?.blur();
                                }
                            }}
                            onClick={e => {
                                cursorPosition.current = {
                                    selectionStart: (e.target as HTMLTextAreaElement).selectionStart,
                                    selectionEnd: (e.target as HTMLTextAreaElement).selectionEnd
                                }
                            }}
                            onChange={e => {
                                onChange({ ...emailBody, message: e.target.value })
                                cursorPosition.current = {
                                    selectionStart: e.target.selectionStart,
                                    selectionEnd: e.target.selectionEnd
                                }
                            }}></textarea>
                        {(showPopup === 'message') && <DynamicValuePopup
                            onClose={() => {
                                setShowPopup(null)
                                setEmailBody({ ...emailBody, message: emailBody.message + '@' })
                            }}
                            onClick={(value) => {
                                if (cursorPosition.current.selectionStart !== 0 && cursorPosition.current.selectionEnd !== 0) {
                                    let firstPart = emailBody.message.slice(0, cursorPosition.current.selectionStart) + '@' + value + ' ';
                                    let secondPart = emailBody.message.slice(cursorPosition.current.selectionEnd);
                                    onChange({ ...emailBody, message: firstPart + secondPart })
                                } else {
                                    onChange({ ...emailBody, message: (emailBody.message + '@' + value + ' ') })
                                }
                                setShowPopup(null)
                            }} />}
                    </div>
                </div>
                <div className="input-container">
                    <div style={{ display: 'flex', gap: 8, alignContent: 'center' }}>
                        <div className="input-box-heading">Footer</div>
                        <CustomTitle containerStyle={{ display: 'flex' }} width={250} title={<div><b>HTML can be included</b> in this field.<br /> Include images using {'<img src=""/>'} tag.<br /> Example: {'<b>'}For Bold{'</b>'}. <br />Use <b>@</b> to add student data. <br />Example: @name - @rollNo</div>}>
                            <div style={{ marginTop: 'auto', height: 19 }}>
                                <Question size={16} />
                            </div>
                        </CustomTitle>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            className="input-box"
                            ref={footerInput}
                            style={{ fontFamily: 'sans-serif', resize: 'vertical', fontSize: '0.9rem' }}
                            name='footer'
                            value={emailBody.footer}
                            placeholder='Footer'
                            onKeyDown={e => {
                                if (e.key === '@') {
                                    setShowPopup('footer');
                                    footerInput.current?.blur();
                                }
                            }}
                            onClick={e => {
                                cursorPosition.current = {
                                    selectionStart: (e.target as HTMLTextAreaElement).selectionStart,
                                    selectionEnd: (e.target as HTMLTextAreaElement).selectionEnd
                                }
                            }}
                            onChange={e => {
                                onChange({ ...emailBody, footer: e.target.value })
                                cursorPosition.current = {
                                    selectionStart: e.target.selectionStart,
                                    selectionEnd: e.target.selectionEnd
                                }
                            }}></textarea>
                        {(showPopup === 'footer') && <DynamicValuePopup
                            height={150}
                            onClose={() => {
                                setShowPopup(null)
                                setEmailBody({ ...emailBody, footer: emailBody.footer + '@' })
                            }}
                            onClick={(value) => {
                                if (cursorPosition.current.selectionStart !== 0 && cursorPosition.current.selectionEnd !== 0) {
                                    let firstPart = emailBody.footer.slice(0, cursorPosition.current.selectionStart) + '@' + value + ' ';
                                    let secondPart = emailBody.footer.slice(cursorPosition.current.selectionEnd);
                                    onChange({ ...emailBody, footer: firstPart + secondPart })
                                } else {
                                    onChange({ ...emailBody, message: (emailBody.message + '@' + value + ' ') })
                                }
                                setShowPopup(null)
                            }} />}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                    <button className="btn-type2" style={{ background: 'var(--accentColor)', color: 'white' }} onClick={() => onSave({ ...emailBody, message: emailBody.message.replace(/\n/g, '<br/>'), footer: emailBody.footer.replace(/\n/g, '<br/>') })}>Save</button>
                    <button className="btn-type2" onClick={() => onCancel()}>Cancel</button>
                </div>
            </div>
        </>
    )
})

export default EmailConfigForm