
import emailjs from "emailjs-com";
import { useState } from "react";
import Loader from "./Loader";
import { useConfirm } from "./ConfirmContextProvider";
import { useAlert } from "./AlertContextProvider";

interface EmailSenderProps {
    emailList: string[],
    msg?: string,
    onComplete?: ({ failedEmails, successEmails }: { failedEmails: string[], successEmails: string[] }) => void
}

const EmailSender: React.FC<EmailSenderProps> = ({ emailList = [], msg = "", onComplete = () => { } }) => {
    const [emailSent, setEmailSent] = useState(false);
    const [progress, setProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);

    const { showWarningConfirm } = useConfirm();
    const { showWarning } = useAlert()
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
                    msg,
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
            {progress > 0 && !emailSent && (
                <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 100, padding: '2rem' }}>
                    <Loader />
                    <div style={{ zIndex: 21, display: 'flex', gap: '0.5rem', width: '30%', alignItems: 'center', justifyContent: 'center', position: 'relative', top: 200 }}>
                        {progress}<progress value={progress} max={totalEmails} style={{ flexGrow: 1 }} />{emailList.length}
                    </div>
                </div>
            )}
            {emailSent ? "" : (
                <form>
                    <button
                        type="submit"
                        onClick={sendBulkEmail}
                        className="btn-type2">Send Email</button>
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