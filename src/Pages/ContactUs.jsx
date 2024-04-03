import Menubar from "../Components/Menubar";
import OwnerFooter from "../Components/OwnerFooter";
import "../Style/ContactUs.css"
import subrata from "../assets/Subrata.png"
import srideep from "../assets/Srideep.jpg"
import GitHub from "../Icons/github";
import LinkedIn from "../Icons/linkedin";
import Gmail from "../Icons/Gmail";

export default function ContactUs() {
    return (
        <>
            <Menubar activeMenuIndex={6} />
            <div className='main-container dashboard'>
                <MainComponents />
                <OwnerFooter />
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
                linkedInLink="https://www.linkedin.com/in/subratachowdhury7000"
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
    picture = { subrata },
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
                    <div className="name">Name: <span className="value">{developerName}</span></div>
                    <div className="name">Email: <span className="value"><a href={"mailto:" + email} target="_blank">{email}</a></span></div>
                </div>
                <div className="contact-details-container">
                    <div className="heading">Contact Using</div>
                    <div className="contact-links">
                        <a href={gitHubLink} className="contact-link" target="_blank">
                            <GitHub />
                        </a>
                        <a href={linkedInLink} className="contact-link" target="_blank">
                            <LinkedIn />
                        </a>
                        <a href={"mailto:" + email} className="contact-link" target="_blank">
                            <Gmail />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}