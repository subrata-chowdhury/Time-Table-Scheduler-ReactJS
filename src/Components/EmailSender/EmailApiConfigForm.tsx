import { memo, useEffect, useState } from "react"
import { ApiData } from "../../data/Types"

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

export default EmailApiConfigForm