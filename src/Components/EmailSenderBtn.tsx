
import emailjs from "emailjs-com";
import React, { memo, useEffect, useState } from "react";
import Loader from "./Loader";
import { useConfirm } from "./ConfirmContextProvider";
import { useAlert } from "./AlertContextProvider";
import { ApiData, Email, Student } from "../data/Types";
import { getConfig, setConfig } from "../Script/configFetchers";
import Question from "../Icons/Question";
import CustomTitle from "./CustomTitle";

interface EmailSenderProps {
    studentsData: Student[],
    onComplete?: ({ failedEmailsStudentData, successEmailsStudentData }: { failedEmailsStudentData: Student[], successEmailsStudentData: Student[] }) => void
}

const EmailSender: React.FC<EmailSenderProps> = ({ studentsData = [], onComplete = () => { } }) => {
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
    const [currentTab, setCurrentTab] = useState<'format' | 'preview' | 'api'>('format');
    const [apiData, setApiData] = useState<ApiData>({
        serviceId: "service_voha47h",
        templateId: "template_qyno7wp",
        userId: "3vPlPvJ0M6_fGCIwZ"
    })

    const { showWarningConfirm } = useConfirm();
    const { showWarning, showSuccess } = useAlert()

    useEffect(() => {
        startUp();
    }, [])

    async function startUp() {
        await getConfig('emailBody', (value) => {
            console.log(value)
            if (value === null) return;
            setEmailBody(value as Email)
        })
        await getConfig('apiData', (value) => {
            if (value === null) return;
            setApiData(value as ApiData)
        })
    }

    // const emailList = ["subratachowdhury275@gmail.com", "banerjee.srideep@gmail.com"]; // Replace with your array of emails
    const totalEmails = studentsData.length;

    const sendBulkEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (totalEmails === 0) return showWarning("Please Filter the data before sending email");
        showWarningConfirm(`Are You Sure you want to send ${totalEmails} emails.`, async () => {
            setProgress(0);
            setSuccessCount(0);
            let failedEmailsStudentData: Student[] = [];
            let successEmailsStudentData: Student[] = [];
            for (let index = 0; index < studentsData.length; index++) {
                await sendEmail(
                    apiData,
                    studentsData[index],
                    emailBody,
                    () => { setSuccessCount(prev => prev + 1); successEmailsStudentData.push(studentsData[index]) },
                    () => { failedEmailsStudentData.push(studentsData[index]); },
                    () => setProgress(prev => prev + 1),
                )
            }
            onComplete({ failedEmailsStudentData, successEmailsStudentData })
            setEmailSent(true)
        })
    };

    const successRate = totalEmails ? (successCount / totalEmails) * 100 : 0;

    return (
        <div style={{ color: 'var(--textColor)' }}>
            {progress > 0 && <p>{progress} of {totalEmails} emails send ({successRate.toFixed(2)}% success rate)</p>}
            {progress > 0 && !emailSent && (
                <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 100, padding: '2rem' }}>
                    <Loader />
                    <div style={{ zIndex: 21, display: 'flex', gap: '0.5rem', width: '30%', alignItems: 'center', justifyContent: 'center', position: 'relative', top: 200 }}>
                        {progress}<progress value={progress} max={totalEmails} style={{ flexGrow: 1 }} />{studentsData.length}
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
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 20 }} onClick={() => setShowEmailTemplate(false)}></div>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '70%', maxHeight: '90vh', borderRadius: 5, zIndex: 30, background: 'var(--containerColor)', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'start', width: 'fit-content', alignItems: 'center', padding: 5, borderRadius: 5, gap: 2, background: 'var(--borderColor)' }}>
                                    <button onClick={() => setCurrentTab('format')} className="btn-type2" style={(currentTab === 'format') ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>Format</button>
                                    <button onClick={() => setCurrentTab('preview')} className="btn-type2" style={(currentTab === 'preview') ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>Preview</button>
                                    <button onClick={() => setCurrentTab('api')} className="btn-type2" style={(currentTab === 'api') ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>API Config</button>
                                </div>
                                {(currentTab === 'format') && <EmailConfigForm
                                    values={emailBody}
                                    onSave={async (body) => {
                                        setConfig('emailBody', body, () => {
                                            setEmailBody(body)
                                            showSuccess("Email Format Save Successfully")
                                        }, () => showWarning('Failed to Save Email Format'))
                                    }}
                                    onCancel={() => setShowEmailTemplate(false)} />}
                                {(currentTab === 'preview') && <EmailPreview {...emailBody} />}
                                {(currentTab === 'api') && <EmailApiConfigForm
                                    values={apiData}
                                    onSave={async (body) => {
                                        setConfig('apiData', body, () => {
                                            setApiData(body)
                                            showSuccess("API Data Save Successfully")
                                        }, () => showWarning('Failed to Save API Data'))
                                    }}
                                    onCancel={() => setShowEmailTemplate(false)} />}
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
    const [showPopup, setShowPopup] = useState<'message' | 'footer' | null>(null);

    useEffect(() => {
        setEmailBody({ ...values, message: values.message.replace(/<br\/>/g, '\n'), footer: values.footer.replace(/<br\/>/g, '\n') })
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
                        onChange={e => onChange({ ...emailBody, subject: e.target.value })} />
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
                        <CustomTitle containerStyle={{ display: 'flex' }} width={250} title={<div><b>HTML can be included</b> in this field.<br /> Include images using {'<img src=""/>'} tag.<br /> Example: {'<b>'}For Bold{'</b>'}. <br />Use <b>@</b> to add student data. <br />Example: @name - @rollNo</div>}>
                            <div style={{ marginTop: 'auto', height: 19 }}>
                                <Question size={16} />
                            </div>
                        </CustomTitle>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            className="input-box"
                            style={{ fontFamily: 'sans-serif', resize: 'vertical', fontSize: '0.9rem' }}
                            name='message'
                            rows={4}
                            value={emailBody.message}
                            placeholder='Message'
                            onKeyDown={e => {
                                if (e.key === '@') {
                                    setShowPopup('message');
                                }
                            }}
                            onChange={e => onChange({ ...emailBody, message: e.target.value })}></textarea>
                        {(showPopup === 'message') && <DynamicValuePopup
                            onClose={() => setShowPopup(null)}
                            onClick={(value) => {
                                setEmailBody({ ...emailBody, message: (emailBody.message + value + ' ') })
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
                            style={{ fontFamily: 'sans-serif', resize: 'vertical', fontSize: '0.9rem' }}
                            name='footer'
                            value={emailBody.footer}
                            placeholder='Footer'
                            onKeyDown={e => {
                                if (e.key === '@') {
                                    setShowPopup('footer');
                                }
                            }}
                            onChange={e => onChange({ ...emailBody, footer: e.target.value })}></textarea>
                        {(showPopup === 'footer') && <DynamicValuePopup
                            height={150}
                            onClose={() => setShowPopup(null)}
                            onClick={(value) => {
                                setEmailBody({ ...emailBody, footer: (emailBody.footer + value + ' ') })
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
                background: "rgba(0,0,0,0.1)",
                color: '#000'
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
                dangerouslySetInnerHTML={{ __html: footer || '' }} ></div>
        </div>
    )
})

type EmailApiConfigFormProps = {
    values: ApiData,
    onSave: (values: ApiData) => void,
    onCancel: () => void
}

const EmailApiConfigForm: React.FC<EmailApiConfigFormProps> = memo(({ values, onSave = () => { }, onCancel = () => { } }) => {
    const [apiData, setApiData] = useState<ApiData>({
        serviceId: "service_voha47h",
        templateId: "template_qyno7wp",
        userId: "3vPlPvJ0M6_fGCIwZ"
    })

    useEffect(() => {
        setApiData(values)
    }, [values])

    function onChange(newValues: ApiData) {
        setApiData(newValues)
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem' }}>
                <div className="input-container">
                    <div className="input-box-heading">Service ID</div>
                    <input
                        type="text"
                        className="input-box"
                        name='serviceId'
                        value={apiData.serviceId}
                        placeholder='Service ID'
                        onChange={e => onChange({ ...apiData, serviceId: e.target.value })}></input>
                </div>
                <div className="input-container">
                    <div className="input-box-heading">Template ID</div>
                    <input
                        type="text"
                        className="input-box"
                        name='templateId'
                        value={apiData.templateId}
                        placeholder='Template ID'
                        onChange={e => onChange({ ...apiData, templateId: e.target.value })}></input>
                </div>
                <div className="input-container">
                    <div className="input-box-heading">User ID</div>
                    <input
                        type="text"
                        className="input-box"
                        name='userId'
                        value={apiData.userId}
                        placeholder='User ID'
                        onChange={e => onChange({ ...apiData, userId: e.target.value })}></input>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                    <button className="btn-type2" style={{ background: 'var(--accentColor)', color: 'white' }} onClick={() => onSave(apiData)}>Save</button>
                    <button className="btn-type2" onClick={() => onCancel()}>Cancel</button>
                </div>
            </div>
        </>
    )
})

async function sendEmail(
    apiData: ApiData,
    studentData: Student,
    emailBody: Email = { subject: "", heading: "", message: "", footer: "" },
    onSuccess: () => void = () => { },
    onError: () => void = () => { },
    finallyCallback: () => void = () => { }) {
    return emailjs
        .send(
            apiData.serviceId || "service_voha47h", // EmailJS service ID
            apiData.templateId || "template_qyno7wp", // EmailJS template ID
            {
                subject: populateWithStudentData(emailBody.subject, studentData) || "",
                heading: populateWithStudentData(emailBody.heading, studentData) || "",
                message: populateWithStudentData(emailBody.message, studentData) || "",
                footer: populateWithStudentData(emailBody.footer, studentData) || "",
                to_email: studentData.email, // Useing the current email from the array
            },
            apiData.userId || "3vPlPvJ0M6_fGCIwZ" // EmailJS user ID
        )
        .then(
            (response) => {
                console.log(`SUCCESS! Email sent to ${studentData.email}`, response.status, response.text);
                if (response.status == 200) onSuccess();
            },
            (err) => {
                console.error(`FAILED to send email to ${studentData.email}`, err);
                onError();
            }
        )
        .finally(() => {
            finallyCallback();
        });
}

function populateWithStudentData(template: string, studentData: Student): string {
    return template.replace(/@name/g, studentData.name)
        .replace(/@email/g, studentData.email)
        .replace(/@attendance/g, String(studentData.attendance))
        .replace(/@rollNo/g, studentData.rollNo)
        .replace(/@semester/g, String(studentData.semester))
        .replace(/@section/g, String(studentData.section))
        .replace(/@phoneNumbers/g, studentData.phoneNumbers || "")
        .replace(/@address/g, studentData.address || "")
        .replace(/@date/g, new Date().toDateString());
}

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