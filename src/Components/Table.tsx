import React from 'react'

type Cell = { [key: string]: string | number }

interface TableProps {
    config: { heading: string, selector?: string, hideAble?: boolean, component?: React.FC<{ data: Cell, index: number }> }[],
    data: Cell[],
    tableStyle?: React.CSSProperties,
}

const Table: React.FC<TableProps> = ({
    config = [],
    data = [],
    tableStyle = {}
}) => {
    if (!config.length) return <div>Invalid Data</div>
    return (
        <table className='table' style={{ border: '2px solid var(--borderColor)', borderRadius: 8, overflow: 'hidden', textAlign: 'start', color: 'var(--textColor)', ...tableStyle }} cellPadding={0} cellSpacing={0}>
            <thead>
                <tr style={{ height: 48, backgroundColor: 'var(--tableHeaderColor)' }}>
                    {config.map((configObj, index) => (
                        <th key={index} style={{ borderBottom: '0px solid var(--borderColor)', textAlign: 'start', paddingLeft: 16, fontWeight: 600 }} className={configObj.hideAble ? "hide-able" : ""}>{configObj.heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((obj, index) => (
                    <tr key={index} style={{ height: 48 }}>
                        {config.map((configObj, innerIndex) => (
                            <td key={innerIndex} style={{ borderTop: '2px solid var(--borderColor)', background: 'var(--containerColor)', paddingLeft: 16 }} className={configObj.hideAble ? "hide-able" : ""} >{configObj.component ? React.createElement(configObj.component, { data: obj, index }) : obj[configObj.selector || ""]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table