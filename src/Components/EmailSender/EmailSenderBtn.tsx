
import React, { memo, useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import { useConfirm } from "../ConfirmContextProvider";
import { useAlert } from "../AlertContextProvider";
import { ApiData, Email, Student } from "../../data/Types";
import { getConfig, setConfig } from "../../Script/configFetchers";
import EmailConfigForm from "./EmailConfigForm";
import EmailApiConfigForm from "./EmailApiConfigForm";
import EmailPreview from "./EmailPreviewer";
import sendEmail from "./lib";

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
    const isFormDirty = useRef<boolean>(false)

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
        getConfig('apiData', (value) => {
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
            {progress > 0 && !emailSent && <EmailLoader progress={progress} totalEmails={totalEmails} totalStudents={studentsData.length} />}

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
                            <button onClick={() => {
                                if (isFormDirty.current) {
                                    showWarningConfirm('You have unsaved changes. Please save it before preview.', () => { }, () => {
                                        isFormDirty.current = false;
                                        setCurrentTab('preview');
                                    })
                                } else {
                                    setCurrentTab('preview')
                                }
                            }} className="btn-type2" style={(currentTab === 'preview') ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>Preview</button>
                            <button onClick={() => setCurrentTab('api')} className="btn-type2" style={(currentTab === 'api') ? { borderColor: 'transparent' } : { borderColor: 'transparent', background: 'transparent' }}>API Config</button>
                        </div>
                        {(currentTab === 'format') && <EmailConfigForm
                            values={emailBody}
                            onSave={async (body) => {
                                setConfig('emailBody', body, () => {
                                    setEmailBody(body);
                                    showSuccess("Email Format Save Successfully");
                                    isFormDirty.current = false
                                }, () => showWarning('Failed to Save Email Format'))
                            }}
                            onEmailBodyChange={() => isFormDirty.current = true}
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
        </div>
    );
};

function EmailLoader({ progress, totalEmails, totalStudents }: { progress: number, totalEmails: number, totalStudents: number }) {
    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 100, padding: '2rem' }}>
            <Loader />
            <div style={{ zIndex: 21, display: 'flex', gap: '0.5rem', width: '30%', alignItems: 'center', justifyContent: 'center', position: 'relative', top: 200 }}>
                {progress}<progress value={progress} max={totalEmails} style={{ flexGrow: 1 }} />{totalStudents}
            </div>
        </div>
    )
}

export default memo(EmailSender)