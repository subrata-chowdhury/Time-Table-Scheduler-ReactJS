
import emailjs from "emailjs-com";
import { useState } from "react";
import Loader from "./Loader";

const EmailSender: React.FC<{ emailList: string[], msg?: string }> = ({ emailList = [], msg = "" }) => {
    const [emailSent, setEmailSent] = useState(false);
    const [progress, setProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    // const emailList = ["subratachowdhury275@gmail.com", "banerjee.srideep@gmail.com"]; // Replace with your array of emails
    const totalEmails = emailList.length;

    const sendBulkEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProgress(0);
        setSuccessCount(0);

        for (let index = 0; index < emailList.length; index++) {
            await sendEmail(
                emailList[index],
                msg,
                () => setSuccessCount(prev => prev + 1),
                () => { },
                () => setProgress(prev => prev + 1)
            )
        }
        setEmailSent(true)
    };

    const successRate = totalEmails ? (successCount / totalEmails) * 100 : 0;

    return (
        <div style={{ color: 'var(--textColor)' }}>
            {progress > 0 && <p>{progress} of {totalEmails} emails sent ({successRate.toFixed(2)}% success rate)</p>}
            {
                progress > 0 && !emailSent && (
                    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 100, padding: '2rem' }}>
                        <Loader />
                        <div style={{ zIndex: 21, display: 'flex', gap: '0.5rem', width: '30%', alignItems: 'center', justifyContent: 'center', position: 'relative', top: 200 }}>
                            {progress}<progress value={progress} max={totalEmails} style={{ flexGrow: 1 }} />{emailList.length}
                        </div>
                    </div>
                )
            }
            {emailSent ? "" : (
                <form onSubmit={sendBulkEmail}>
                    <button
                        type="submit"
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.6rem 1rem',
                            paddingLeft: '1rem',
                            backgroundColor: 'var(--containerColor)',
                            border: '2px solid var(--borderColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>Send Email</button>
                </form>
            )}
        </div>
    );
};

export default EmailSender


async function sendEmail(email: string, msg: string = "", onSuccess: () => void = () => { }, onError: () => void = () => { }, finallyCallback: () => void = () => { }) {
    return emailjs
        .send(
            "service_voha47h", // Replace with your EmailJS service ID
            "template_qyno7wp", // Replace with your EmailJS template ID
            {
                to_name: "Recipient " + email,
                message: msg || "This is a test email sent from React!",
                to_email: email, // Use the current email from the array
            },
            "3vPlPvJ0M6_fGCIwZ" // Replace with your EmailJS user ID
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