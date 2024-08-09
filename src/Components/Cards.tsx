import Plus from "../Icons/Plus.tsx";
import "../Style/Cards.css"
import Arrow from '../Icons/Arrow.tsx'
import { memo, useCallback, useRef, useState } from "react";
import EditIcon from "../Icons/Edit.tsx";
import React from "react";

interface CardsProps {
    cardDetails?: string[],
    cardClassName?: string,
    cardClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void,
    addBtnClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void,
    canStayActiveMultipleCards?: boolean,
    cardsContainer?: React.RefObject<HTMLDivElement>,
    showEditBtn?: boolean
}

const Cards: React.FC<CardsProps> = ({
    cardDetails = [],
    cardClassName = "",
    cardClickHandler = () => { },
    addBtnClickHandler = () => { },
    canStayActiveMultipleCards = false,
    cardsContainer = useRef<HTMLDivElement | null>(null),
    showEditBtn = false
}) => {

    let cards = [];
    for (let index = 0; index < cardDetails.length; index++) {
        cards.push(
            <Card
                details={cardDetails[index]}
                key={index}
                cardClickHandler={(e) => {
                    cardClickHandler(e)
                }}
                className={cardClassName}
                canStayActiveMultipleCards={canStayActiveMultipleCards}
                cardsContainer={cardsContainer}
                showEditBtn={showEditBtn}
            ></Card>
        )
    }
    return (
        <div className="cards-container" ref={cardsContainer}>
            <div className="card add" onClick={addBtnClickHandler}>
                <Plus />
            </div>

            {cards}
        </div>
    )
}

export default memo(Cards)

interface CardProps {
    details: string,
    className?: string,
    cardClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void,
    compressText?: boolean,
    canStayActiveMultipleCards?: boolean,
    cardsContainer: React.RefObject<HTMLDivElement>,
    showEditBtn?: boolean,
    editBtnClickHandler?: (details: string) => void
}

export const Card: React.FC<CardProps> = memo(({
    details = "Sample",
    className = "",
    cardClickHandler = () => { },
    compressText = true,
    canStayActiveMultipleCards,
    cardsContainer,
    showEditBtn,
    editBtnClickHandler = () => { }
}) => {
    const [active, setActive] = useState<boolean>(false)
    const defaultClickHandler = useCallback(() => {
        if (canStayActiveMultipleCards) {
            setActive(!active)
        } else {
            if (cardsContainer.current == null || cardsContainer.current.childNodes.length > 0) return
            cardsContainer.current.childNodes.forEach((child) => {
                let card = child as HTMLDivElement
                card.classList.remove('active')
            })
            setActive(true)
        }
    }, [canStayActiveMultipleCards, active, cardsContainer])

    const innerCard = (
        <div className={"card data " + className + (active ? ' active' : '')} onClick={(e) => {
            defaultClickHandler()
            cardClickHandler(e)
        }} title={details}>
            {compressText ? (details.length > 6 ? details.slice(0, 5) + ".." : details) : details}
        </div>
    )
    return (
        (showEditBtn ? (
            <div className="card-wrapper">
                <div className="edit-btn" onClick={() => { editBtnClickHandler(details) }}><EditIcon /></div>
                {innerCard}
            </div>
        ) : innerCard)
    )
})

interface HorizentalCardsContainerProps {
    cardData?: string[],
    className?: string,
    cardClassName?: string,
    cardClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void,
    compressText?: boolean,
    cardsContainer?: React.RefObject<HTMLDivElement>,
    showEditBtn?: boolean,
    editBtnClickHandler?: (details: string) => void
}

export const HorizentalCardsContainer: React.FC<HorizentalCardsContainerProps> = memo(({
    cardData = [],
    className = "",
    cardClassName,
    cardClickHandler,
    compressText,
    cardsContainer = useRef<HTMLDivElement | null>(null),
    showEditBtn = false,
    editBtnClickHandler
}) => {
    let cards = [];
    for (let index = 0; index < cardData.length; index++) {
        cards.push(
            <Card
                details={cardData[index]}
                key={index}
                className={cardClassName}
                cardClickHandler={cardClickHandler}
                compressText={compressText}
                cardsContainer={cardsContainer}
                showEditBtn={showEditBtn}
                editBtnClickHandler={editBtnClickHandler}
            />
        )
    }
    const horizentalCardsOnWheelHandler = useCallback((event: React.WheelEvent) => {
        if (cardsContainer.current == null) return
        cardsContainer.current.scrollLeft += (event.deltaY);
    }, [])
    const arrowClickHandler = useCallback((value: number) => {
        if (cardsContainer.current == null) return
        cardsContainer.current.scrollLeft += value;
        showLeftArrow()
    }, [])
    const [showArrow, setShowArrow] = useState(false)
    const showLeftArrow = useCallback(() => {
        if (cardsContainer.current == null) return
        if (cardsContainer.current.scrollLeft >= 120) {
            setShowArrow(true)
        } else {
            setShowArrow(false)
        }
    }, [])
    return (
        <div className={'horizental-cards-container ' + className} onWheel={horizentalCardsOnWheelHandler}>
            <Arrow className="left-arrow-for-scroll arrow-for-scroll" arrowStyle={{ zIndex: showArrow ? "1" : "-10" }} arrowIconClickHandler={() => { arrowClickHandler(-125) }} />
            <div className='sub-horizental-cards-container' ref={cardsContainer}>
                {cards}
            </div>
            <Arrow className="right-arrow-for-scroll arrow-for-scroll" arrowIconClickHandler={() => { arrowClickHandler(125) }} />
        </div>
    )
})