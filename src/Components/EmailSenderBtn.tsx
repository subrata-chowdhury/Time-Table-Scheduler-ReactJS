
import emailjs from "emailjs-com";
import React, { memo, useEffect, useState } from "react";
import Loader from "./Loader";
import { useConfirm } from "./ConfirmContextProvider";
import { useAlert } from "./AlertContextProvider";
import { Email } from "../data/Types";
import { getConfig, setConfig } from "../Script/configFetchers";
import Question from "../Icons/Question";
import CustomTitle from "./CustomTitle";

interface EmailSenderProps {
    emailList: string[],
    onComplete?: ({ failedEmails, successEmails }: { failedEmails: string[], successEmails: string[] }) => void
}

const EmailSender: React.FC<EmailSenderProps> = ({ emailList = [], onComplete = () => { } }) => {
    const [emailSent, setEmailSent] = useState(false);
    const [progress, setProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [emailBody, setEmailBody] = useState<Email>({
        subject: "",
        heading: "",
        message: "",
        footer: ""
    })
    const [showEmailTemplate, setShowEmailTemplate] = useState<boolean>(false);
    const [showPreview, setShowPreview] = useState(false);

    const { showWarningConfirm } = useConfirm();
    const { showWarning, showSuccess } = useAlert()

    useEffect(() => {
        startUp();
    }, [])

    function startUp() {
        getConfig('emailBody', (value) => {
            if (value === null) return;
            setEmailBody(value as Email)
        })
    }

    // const emailList = ["subratachowdhury275@gmail.com", "banerjee.srideep@gmail.com"]; // Replace with your array of emails
    const totalEmails = emailList.length;

    const sendBulkEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (totalEmails === 0) return showWarning("Please Filter the data before sending email");
        showWarningConfirm(`Are You Sure you want to send ${totalEmails} emails.`, async () => {
            setProgress(0);
            setSuccessCount(0);
            let failedEmails: string[] = [];
            let successEmails: string[] = [];

            for (let index = 0; index < emailList.length; index++) {
                await sendEmail(
                    emailList[index],
                    emailBody,
                    () => { setSuccessCount(prev => prev + 1); successEmails.push(emailList[index]) },
                    () => failedEmails.push(emailList[index]),
                    () => setProgress(prev => prev + 1)
                )
            }
            onComplete({ failedEmails, successEmails: successEmails })
            setEmailSent(true)
        })
    };

    const successRate = totalEmails ? (successCount / totalEmails) * 100 : 0;

    return (
        <div style={{ color: 'var(--textColor)' }}>
            {progress > 0 && <p>{progress} of {totalEmails} emails send ({successRate.toFixed(2)}% success rate)</p>}
            {progress > 0 && (
                <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 100, padding: '2rem' }}>
                    <Loader />
                    <div style={{ zIndex: 21, display: 'flex', gap: '0.5rem', width: '30%', alignItems: 'center', justifyContent: 'center', position: 'relative', top: 200 }}>
                        {progress}<progress value={progress} max={totalEmails} style={{ flexGrow: 1 }} />{emailList.length}
                    </div>
                </div>
            )}
            {emailSent ? "" : (
                <>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={sendBulkEmail} className="btn-type2">Send Email</button>
                        <button className="btn-type2" onClick={() => setShowEmailTemplate(val => !val)}>Template</button>
                    </div>
                    {showEmailTemplate &&
                        <>
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.1)', zIndex: 20 }} onClick={() => setShowEmailTemplate(false)}></div>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '70%', maxHeight: '90vh', borderRadius: 5, zIndex: 30, background: 'var(--containerColor)', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'start', width: 'fit-content', alignItems: 'center', padding: 5, borderRadius: 5, gap: 2, background: 'var(--borderColor)' }}>
                                    <button onClick={() => setShowPreview(false)} className="btn-type2" style={!showPreview ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>Format</button>
                                    <button onClick={() => setShowPreview(true)} className="btn-type2" style={showPreview ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>Preview</button>
                                </div>
                                {!showPreview && <EmailConfigForm values={emailBody} onSave={async (body) => {
                                    setConfig('emailBody', body, () => {
                                        setEmailBody(body)
                                        showSuccess("Email Format Save Successfully")
                                    }, () => showWarning('Failed to Save Email Format'))
                                }} onCancel={() => setShowEmailTemplate(false)} />}
                                {showPreview && <EmailPreview {...emailBody} />}
                            </div>
                        </>}
                </>
            )}
        </div>
    );
};

export default memo(EmailSender)

type EmailConfigFormProps = {
    values: Email,
    onSave: (values: Email) => void,
    onCancel: () => void
}

const EmailConfigForm: React.FC<EmailConfigFormProps> = memo(({ values, onSave = () => { }, onCancel = () => { } }) => {
    const [emailBody, setEmailBody] = useState<Email>({
        subject: "",
        heading: "",
        message: "",
        footer: ""
    })

    useEffect(() => {
        setEmailBody(values)
    }, [values])

    function onChange(newValues: Email) {
        setEmailBody(newValues)
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem' }}>
                <div className="input-container">
                    <div className="input-box-heading">Subject</div>
                    <input
                        type="text"
                        className="input-box"
                        name='subject'
                        value={emailBody.subject}
                        placeholder='Subject of the Email'
                        onChange={e => onChange({ ...emailBody, subject: e.target.value })}></input>
                </div>
                <div className="input-container">
                    <div className="input-box-heading">Heading</div>
                    <input
                        type="text"
                        className="input-box"
                        name='heading'
                        value={emailBody.heading}
                        placeholder='Heading'
                        onChange={e => onChange({ ...emailBody, heading: e.target.value })}></input>
                </div>
                <div className="input-container">
                    <div style={{ display: 'flex', gap: 8, alignContent: 'center' }}>
                        <div className="input-box-heading">Message</div>
                        <CustomTitle title='HTML can be included in this field
Include images using <img src=""/> tag.
Example: <b>For Bold</b>'>
                            <div style={{ marginTop: 'auto', cursor: 'pointer' }}>
                                <Question size={16} />
                            </div>
                        </CustomTitle>
                    </div>
                    <textarea
                        className="input-box"
                        style={{ fontFamily: 'sans-serif' }}
                        name='message'
                        rows={4}
                        value={emailBody.message}
                        placeholder='Message'
                        onChange={e => onChange({ ...emailBody, message: e.target.value })}></textarea>
                </div>
                <div className="input-container">
                    <div style={{ display: 'flex', gap: 8, alignContent: 'center' }}>
                        <div className="input-box-heading">Footer</div>
                        <CustomTitle title='HTML can be included in this field, 
Include images using <img src=""/> tag.
Example: <b>For Bold</b>'>
                            <div style={{ marginTop: 'auto', cursor: 'pointer' }}>
                                <Question size={16} />
                            </div>
                        </CustomTitle>
                    </div>
                    <textarea
                        className="input-box"
                        style={{ fontFamily: 'sans-serif' }}
                        name='footer'
                        value={emailBody.footer}
                        placeholder='Footer'
                        onChange={e => onChange({ ...emailBody, footer: e.target.value })}></textarea>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                    <button className="btn-type2" style={{ background: 'var(--accentColor)', color: 'white' }} onClick={() => onSave(emailBody)}>Save</button>
                    <button className="btn-type2" onClick={() => onCancel()}>Cancel</button>
                </div>
            </div>
        </>
    )
})

type EmailPreviewProps = Email

const EmailPreview: React.FC<EmailPreviewProps> = memo(({
    heading = "",
    message = "",
    footer = ""
}) => {
    return (
        <div
            style={{
                margin: "1rem",
                paddingTop: "0.1rem",
                fontFamily: "sans-serif",
                background: "rgba(0,0,0,0.1)"
            }}
        >
            <div
                style={{
                    margin: "1rem",
                    padding: "1rem",
                    paddingTop: "0.1rem",
                    borderRadius: 8,
                    background: "white"
                }}
            >
                <h2 dangerouslySetInnerHTML={{ __html: heading || '' }}></h2>
                <p dangerouslySetInnerHTML={{ __html: message || '' }}></p>
            </div>
            <div
                style={{ backgroundColor: "dodgerblue", padding: 18, color: "white" }}
                dangerouslySetInnerHTML={{ __html: footer || '' }}
            >

            </div>
        </div>
    )
})


async function sendEmail(
    email: string,
    emailBody: Email = { subject: "", heading: "", message: "", footer: "" },
    onSuccess: () => void = () => { },
    onError: () => void = () => { },
    finallyCallback: () => void = () => { }) {
    return emailjs
        .send(
            "service_voha47h", // EmailJS service ID
            "template_qyno7wp", // EmailJS template ID
            {
                subject: emailBody.subject || "",
                heading: emailBody.heading || "",
                message: emailBody.message || "",
                footer: emailBody.footer || "",
                to_email: email, // Useing the current email from the array
            },
            "3vPlPvJ0M6_fGCIwZ" // EmailJS user ID
        )
        .then(
            (response) => {
                console.log(`SUCCESS! Email sent to ${email}`, response.status, response.text);
                if (response.status == 200) onSuccess();
            },
            (err) => {
                console.error(`FAILED to send email to ${email}`, err);
                onError();
            }
        )
        .finally(() => {
            finallyCallback();
        });
}