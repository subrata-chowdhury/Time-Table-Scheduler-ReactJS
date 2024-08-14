import { memo, useCallback, useRef } from "react"
import { Card } from "../../Components/Cards"

interface ButtonsContainerProps {
    onAutoFillBtnClick?: () => void
    onFillManuallyBtnClick?: (value: string) => void
}

const ButtonsContainer: React.FC<ButtonsContainerProps> = memo(({ onAutoFillBtnClick, onFillManuallyBtnClick = () => { } }) => {
    const btnContainer = useRef<HTMLDivElement>(null)
    return (
        <div className='buttons-container' ref={btnContainer}>
            <Card details='Auto Fill Using AI' className='btn' onClick={onAutoFillBtnClick}></Card>
            <Card details='Fill Manually' className='btn' onClick={onFillManuallyBtnClick}></Card>
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