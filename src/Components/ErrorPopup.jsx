import "../Style/ErrorPopup.css"

export default function ErrorPopup({ errors = [] }) {
    let errorsUI = []
    for (let index = 0; index < errors.length; index++) {
        errorsUI.push(<Error msg={errors[index]} key={index} />)
    }
    return (
        <div className="error-popups-container">
            {errorsUI}
        </div>
    )
}

export function Error({ msg = "error", warn = true }) {
    return (
        <div className="error-container">
            <div className="error-msg">{msg}</div>
            <div className="close-error-btn icon" >
                x
            </div>
        </div>
    )
}

// const [errors, setErrors] = useState([])
// function showError(msg) {
//     let newErrors = [...errors];
//     newErrors.push(msg);
//     setErrors(newErrors);
// }
// function closeError() {
//     let newErrors = errors.slice(1);
//     setErrors(newErrors);
// }