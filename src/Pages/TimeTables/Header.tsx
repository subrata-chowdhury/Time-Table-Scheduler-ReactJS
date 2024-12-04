import { memo, useCallback, useRef, useState } from "react"
import { Card } from "../../Components/Cards"

interface ButtonsContainerProps {
    onAutoFillBtnClick?: () => void
    onFillManuallyBtnClick?: (value: boolean) => void
}

const ButtonsContainer: React.FC<ButtonsContainerProps> = memo(({ onAutoFillBtnClick = () => { }, onFillManuallyBtnClick = () => { } }) => {
    const [fillManually, setFillManually] = useState<boolean>(true)

    return (
        <div className='buttons-container'>
            <Card details='Auto Fill Using AI' className={'btn'} onClick={onAutoFillBtnClick}></Card>
            <div className="input-container" style={{ gap: '0.8rem' }}>
                Fill Manually:
                <div className={'box'} onClick={() => {
                    setFillManually(value => !value)
                    onFillManuallyBtnClick(!fillManually)
                }}>
                    <div className={'option' + (fillManually ? " active" : "")}>On</div>
                    <div className={'option' + (!fillManually ? " active" : "")}>Off</div>
                </div>
            </div>
        </div>
    )
})

interface SectionsBtnContainerProps {
    noOfSections: number
    currentOpenSection: number
    setCurrentOpenSection: (section: number) => void
}

const SectionsBtnContainer: React.FC<SectionsBtnContainerProps> = memo(({ noOfSections = 3, currentOpenSection, setCurrentOpenSection }) => {
    const sectionsBtnContainer = useRef<HTMLDivElement>(null)
    const sectionBtnsClickHandler = useCallback((val: string) => {
        setCurrentOpenSection(val.charCodeAt(0) - 65)
    }, [])

    let sectionBtns = [];
    for (let index = 0; index < noOfSections; index++) {
        let char = String.fromCharCode(65 + index);
        sectionBtns.push(
            <Card
                details={char}
                key={index}
                className={'section-btn'}
                active={index === currentOpenSection}
                onClick={sectionBtnsClickHandler}
            />
        )
    }
    return (
        <div className='section-btn-container' ref={sectionsBtnContainer}>
            {sectionBtns}
        </div>
    )
})

export { ButtonsContainer, SectionsBtnContainer }