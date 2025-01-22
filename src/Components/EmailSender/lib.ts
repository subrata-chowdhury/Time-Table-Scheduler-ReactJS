import emailjs from "emailjs-com";
import { ApiData, Email, Student } from "../../data/Types";

export default async function sendEmail(
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
        .replace(/@attendance/g, (String(studentData.attendance) + '%'))
        .replace(/@rollNo/g, studentData.rollNo)
        .replace(/@semester/g, String(studentData.semester))
        .replace(/@section/g, String.fromCharCode(studentData.section + 65))
        .replace(/@phoneNumbers/g, studentData.phoneNumbers || "")
        .replace(/@address/g, studentData.address || "")
        .replace(/@date/g, new Date().toDateString());
}