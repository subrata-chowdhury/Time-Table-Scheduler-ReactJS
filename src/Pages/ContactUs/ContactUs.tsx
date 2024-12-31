import "../../Style/Pages/ContactUs.css"
import subrata from "../../assets/Subrata.png"
import srideep from "../../assets/Srideep.jpg"
import GitHub from "../../Icons/github";
import LinkedIn from "../../Icons/linkedin";
import Gmail from "../../Icons/Gmail";

export default function ContactUs() {
    return (
        <>
            <div className='page contactus'>
                <MainComponents />
            </div>
        </>
    )
}

function MainComponents() {
    return (
        <div className="developers-container">
            <Developer
                picture={subrata}
                role="Frontend"
                developerName="Subrata Chowdhury"
                gitHubLink="https://github.com/Super7000"
                linkedInLink="https://www.linkedin.com/in/subrata7000"
                email="subratachowdhury7000@gmail.com" />
            <Developer
                picture={srideep}
                role="Backend"
                developerName="Srideep Banerjee"
                gitHubLink="https://github.com/srideep-banerjee"
                linkedInLink="https://www.linkedin.com/in/srideep-banerjee-64b712251/"
                email="banerjee.srideep@gmail.com" />
        </div>
    )
}

function Developer({
    picture = subrata,
    role = "Frontend",
    developerName = "Name",
    gitHubLink = "https://github.com/Super7000",
    linkedInLink = "https://www.linkedin.com/in/srideep-banerjee-64b712251/",
    email = ""
}) {
    return (
        <div className="developer">
            <div className="heading role">{role} Developer</div>
            <div className="profile-picture-container">
                <img src={picture} className="profile-pic" alt="profile picture"></img>
            </div>
            <div className="developer-details-container">
                <div className="basic-details">
                    <div className="field">
                        <div className="field-name">Name:</div>
                        <div className="value">{developerName}</div>
                    </div>
                    <div className="field email">
                        <div className="field-name">Email:</div>
                        <div className="value"><a href={"mailto:" + email} target="_blank">{email}</a></div>
                    </div>
                </div>
                <div className="contact-details-container">
                    <div className="heading">Contact Using</div>
                    <div className="contact-links" style={{ marginTop: "0.5rem" }}>
                        <a href={gitHubLink} className="contact-link" target="_blank" style={{ paddingRight: "0.5rem" }}>
                            <GitHub size={24} />
                        </a>
                        <a href={linkedInLink} className="contact-link" target="_blank">
                            <LinkedIn size={25} />
                        </a>
                        <a href={"mailto:" + email} className="contact-link" target="_blank">
                            <Gmail size={35} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}