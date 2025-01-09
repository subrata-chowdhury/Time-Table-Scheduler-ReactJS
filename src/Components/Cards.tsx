import Plus from "../Icons/Plus";
import "../Style/Cards.css"
import Arrow from '../Icons/Arrow'
import { memo, useCallback, useEffect, useRef, useState } from "react";
import EditIcon from "../Icons/Edit";
import React from "react";

interface CardsProps {
    cardList?: string[],
    cardClassName: string,
    onCardClick?: (name: string) => void,
    onAddBtnClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    canStayActiveMultipleCards?: boolean,
    showEditBtn?: boolean
    onEditBtnClick?: (details: string) => void,
    onActive?: (activeCards?: string[]) => void
}

const Cards: React.FC<CardsProps> = ({
    cardList = [],
    cardClassName = "",
    onCardClick = () => { },
    onAddBtnClick = () => { },
    canStayActiveMultipleCards = false,
    showEditBtn = false,
    onEditBtnClick = () => { },
    onActive = () => { }
}) => {
    const [activeCards, setActiveCards] = useState<string[]>([])

    const defaultCardClickHandler = useCallback((card: string) => {
        let newActiveCards = [...activeCards]
        if (canStayActiveMultipleCards) {
            if (activeCards.includes(card)) {
                newActiveCards = activeCards.filter(activeCard => activeCard !== card)
            } else {
                newActiveCards = [...activeCards, card]
            }
        } else {
            newActiveCards = [card]
        }
        setActiveCards(newActiveCards)
        onActive(newActiveCards)
    }, [activeCards, canStayActiveMultipleCards])

    return (
        <div className="cards-container">
            <div className="card add" onClick={(e) => {
                setActiveCards([])
                onAddBtnClick(e)
            }}>
                <Plus />
            </div>
            {cardList && cardList.length > 0 && cardList.map((card) => (
                <Card
                    details={card}
                    key={card}
                    className={cardClassName}
                    active={activeCards.includes(card)}
                    onClick={(card) => {
                        defaultCardClickHandler(card)
                        onCardClick(card)
                    }}
                    compressText={false}
                    showEditBtn={showEditBtn}
                    onEditBtnClick={onEditBtnClick}
                />
            ))}
        </div>
    )
}

export default memo(Cards)

interface CardProps {
    details: string,
    className: string,

    active?: boolean,
    onClick?: (card: string) => void,
    compressText?: boolean,
    showEditBtn?: boolean,
    onEditBtnClick?: (details: string) => void
}

export const Card: React.FC<CardProps> = memo(({
    details = "Sample",
    className = "",

    active = false,
    onClick = () => { },
    compressText = false,
    showEditBtn = false,
    onEditBtnClick = () => { }
}) => {
    const innerCard = (
        <div className={"card data " + className + (active ? ' active' : '')} onClick={() => onClick(details)} title={details}>
            {compressText ? (details.length > 6 ? details.slice(0, 5) + ".." : details) : details}
        </div>
    )
    return (
        (showEditBtn ? (
            <div className="card-wrapper">
                <div className="edit-btn" onClick={() => { onEditBtnClick(details) }}><EditIcon /></div>
                {innerCard}
            </div>
        ) : innerCard)
    )
})

interface HorizentalCardsContainerProps {
    cardList?: string[],
    className?: string,
    onChange?: (activeCards?: string[]) => void,
    cardClassName?: string,
    onCardClick?: (name: string) => void,
    compressText?: boolean,
    showEditBtn?: boolean,
    onEditBtnClick?: (details: string) => void,
    canStayActiveMultipleCards?: boolean
}

export const HorizentalCardsContainer: React.FC<HorizentalCardsContainerProps> = memo(({
    cardList = [],
    className = "",
    onChange = () => { },
    cardClassName = "",
    onCardClick = () => { },
    compressText,
    showEditBtn = false,
    onEditBtnClick,
    canStayActiveMultipleCards = false
}) => {
    const cardsContainer = useRef<HTMLDivElement>(null)
    const [showArrow, setShowArrow] = useState(false)
    const [activeCards, setActiveCards] = useState<string[]>([])

    useEffect(() => {
        if (cardList.length > 0) {
            setActiveCards([cardList[0]])
            onCardClick(cardList[0])
        }
    }, [cardList])

    const defaultCardClickHandler = useCallback((card: string) => {
        let newActiveCards = [...activeCards]
        if (canStayActiveMultipleCards) {
            if (activeCards.includes(card)) {
                newActiveCards = activeCards.filter(activeCard => activeCard !== card)
            } else {
                newActiveCards = [...activeCards, card]
            }
        } else {
            newActiveCards = [card]
        }
        setActiveCards(newActiveCards)
        onChange(newActiveCards)
    }, [activeCards, canStayActiveMultipleCards])

    const horizentalCardsOnWheelHandler = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
        if (cardsContainer.current == null) return
        cardsContainer.current.scrollLeft += (event.deltaY);
        showLeftArrow()
    }, [])
    const arrowClickHandler = useCallback((value: number) => {
        if (cardsContainer.current == null) return
        cardsContainer.current.scrollLeft += value;
        showLeftArrow()
    }, [])
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
            <Arrow className="left-arrow-for-scroll arrow-for-scroll" arrowStyle={{ zIndex: (showArrow ? "1" : "-10"), width: '1.5rem', height: '1.5rem' }} arrowIconClickHandler={() => { arrowClickHandler(-125) }} />
            <div className='sub-horizental-cards-container' ref={cardsContainer}>
                {cardList && cardList.length > 0 && cardList.map((card) => {
                    return (
                        <Card
                            details={card}
                            key={card}
                            className={cardClassName}
                            active={activeCards.includes(card)}
                            onClick={() => {
                                defaultCardClickHandler(card)
                                onCardClick(card)
                            }}
                            compressText={compressText}
                            showEditBtn={showEditBtn}
                            onEditBtnClick={onEditBtnClick}
                        />
                    );
                })}
            </div>
            <Arrow className="right-arrow-for-scroll arrow-for-scroll" arrowStyle={{ width: '1.5rem', height: '1.5rem' }} arrowIconClickHandler={() => { arrowClickHandler(125) }} />
        </div>
    )
})