import { memo } from "react"
import { Email } from "../../data/Types"

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

export default EmailPreview