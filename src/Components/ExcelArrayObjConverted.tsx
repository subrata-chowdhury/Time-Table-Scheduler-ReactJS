import React, { memo, useRef, useState } from "react";
import ArrowWithLine from "../Icons/ArrowWithLine";
import Table from "./Table";

interface ExcelArrayObjConvertedProps {
    onImport?: (data: object[]) => void;
    onExport?: (data: object[]) => void;
    exportDataGetter?: () => Promise<object[]>;
}

const ExcelArrayObjConverted: React.FC<ExcelArrayObjConvertedProps> = ({
    onExport = () => { },
    exportDataGetter = async () => [],
    onImport = () => { },
}) => {
    const [data, setData] = useState<object[]>([]);
    const [show, setShow] = useState(false);
    const [yesBtnLabel, setYesBtnLabel] = useState('Download');
    const fileInput = useRef<HTMLInputElement | null>(null);

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];

        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

        if (fileExtension === "csv") {
            parseCSV(file, (arryaOfObjects) => {
                setData(arryaOfObjects);
            });
            setShow(true);
            setYesBtnLabel('Import');
        } else if (["xls", "xlsx"].includes(fileExtension)) {
            parseExcel(file, (arryaOfObjects) => {
                setData(arryaOfObjects);
            });
            setShow(true);
            setYesBtnLabel('Import');
        } else {
            alert("Unsupported file type. Please upload a CSV or Excel file.");
        }
    };


    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input key={new Date().toISOString()} type="file" ref={fileInput} onChange={handleFileChange} accept=".csv,.xls,.xlsx" style={{ display: 'none' }} />
            <button
                onClick={() => fileInput.current ? fileInput.current.click() : ""}
                className="btn-type2">
                <ArrowWithLine />Import
            </button>
            <button
                onClick={async () => {
                    const fetchedData = await exportDataGetter();
                    setData(fetchedData);
                    setShow(true);
                    setYesBtnLabel('Download');
                }}
                className="btn-type2">
                <ArrowWithLine rotate={180} />Export
            </button>
            <PopUp
                data={data}
                show={show}
                onYesBtnClick={() => {
                    if (yesBtnLabel === 'Import') onImport(data);
                    else downloadExcel(data, (arrayOfObject) => onExport(arrayOfObject))
                }}
                onCancelBtnClick={() => setShow(false)}
                yesBtnLabel={yesBtnLabel} />
        </div>
    );
};

interface PopUpProps {
    data?: object[];
    show: boolean;
    yesBtnLabel?: string;
    onYesBtnClick?: () => void;
    onCancelBtnClick?: () => void;
}

const PopUp: React.FC<PopUpProps> = memo(({ data, show, yesBtnLabel = 'Download', onYesBtnClick, onCancelBtnClick }) => {
    return (
        <>
            <div
                style={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    display: show ? 'flex' : 'none',
                    justifyContent: 'center',
                    zIndex: 100,
                    alignItems: 'center'
                }}
                onClick={() => onCancelBtnClick ? onCancelBtnClick() : ""}>
            </div>
            {data && data?.length > 0 && <div
                style={{
                    display: show ? 'block' : 'none',
                    zIndex: 101,
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--containerColor)',
                    padding: '1.5rem 2rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    width: '80%',
                }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>Data</div>
                <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                    <Table
                        config={Object.keys(data[0]).map((key) => ({ heading: key.charAt(0).toUpperCase() + key.slice(1), selector: key }))}
                        data={data as any}
                        tableStyle={{ marginTop: '1rem', width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={() => onYesBtnClick ? onYesBtnClick() : ""}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--accentColor)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 5,
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}>
                        {yesBtnLabel}
                    </button>
                    <button
                        onClick={() => onCancelBtnClick ? onCancelBtnClick() : ""}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--containerColor)',
                            color: 'var(--textColor)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            border: '2px solid var(--borderColor)',
                            fontSize: '1rem',
                        }}>
                        Cancel
                    </button>
                </div>
            </div>}
            {
                (!data || data.length === 0) && <div style={{ padding: '1rem', backgroundColor: 'var(--containerColor)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', color: 'var(--textColor)', display: show ? 'flex' : 'none' }}>No data to export</div>
            }
        </>
    );
})

export default memo(ExcelArrayObjConverted);


// Parse CSV files
const parseCSV = (file: File, onComplete: (arryaOfObjects: object[]) => void) => {
    import("papaparse").then(Papa => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                onComplete(result.data as object[])
                // console.log("CSV Data:", result.data);
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
            },
        });
    });
};

// Parse Excel files
const parseExcel = (file: File, onComplete: (arryaOfObjects: object[]) => void) => {
    import("xlsx").then(XLSX => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                const data = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0]; // Get the first sheet
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);
                onComplete(json as object[]);
                // console.log("Excel Data:", json);
            }
        };
        reader.onerror = (error) => {
            console.error("Error reading Excel file:", error);
        };
        reader.readAsArrayBuffer(file);
    })
};

// Convert and save as Excel
const downloadExcel = async (data: object[], onExport: (arrayOfObject: object[]) => void) => {
    import("xlsx").then(XLSX => {
        const fetchedData = data; // Fetch data dynamically
        const worksheet = XLSX.utils.json_to_sheet(fetchedData); // Create worksheet
        const workbook = XLSX.utils.book_new(); // Create workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Append sheet
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveFileUsingAnchorTag(excelBuffer, "data.xlsx", "application/octet-stream");
        onExport(fetchedData);
    })
};

// Save file using Anchor Tag and Blob URL
const saveFileUsingAnchorTag = (data: any, fileName: string, fileType: string) => {
    const blob = new Blob([data], { type: fileType });
    const url = URL.createObjectURL(blob); // Create Blob URL
    const anchor = document.createElement("a"); // Create anchor tag
    anchor.href = url;
    anchor.download = fileName; // Set download file name
    anchor.style.display = "none"; // Hide anchor
    document.body.appendChild(anchor); // Append anchor to body
    anchor.click(); // Trigger click event to download file
    document.body.removeChild(anchor); // Remove anchor
    URL.revokeObjectURL(url); // Release Blob URL
};

export { parseCSV, parseExcel, downloadExcel, saveFileUsingAnchorTag };