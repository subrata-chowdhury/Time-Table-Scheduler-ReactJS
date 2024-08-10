import Plus from "../Icons/Plus.tsx";
import "../Style/Cards.css"
import Arrow from '../Icons/Arrow.tsx'
import { memo, useCallback, useRef, useState } from "react";
import EditIcon from "../Icons/Edit.tsx";
import React from "react";

interface CardsProps {
    cardList?: string[],
    cardClassName: string,
    onCardClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    onAddBtnClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    canStayActiveMultipleCards?: boolean,
    cardsContainer?: React.RefObject<HTMLDivElement>,
    showEditBtn?: boolean
    onEditBtnClick?: (details: string) => void,
    onChange?: (activeCards?: string[]) => void
}

const Cards: React.FC<CardsProps> = ({
    cardList = [],
    cardClassName = "",
    onCardClick = () => { },
    onAddBtnClick = () => { },
    canStayActiveMultipleCards = false,
    cardsContainer = useRef<HTMLDivElement | null>(null),
    showEditBtn = false,
    onEditBtnClick = () => { },
    onChange = () => { }
}) => {
    const [activeCards, setActiveCards] = useState<string[]>([])

    const defaultCardClickHandler = useCallback((card: string) => {
        if (canStayActiveMultipleCards) {
            if (activeCards.includes(card)) {
                setActiveCards(activeCards.filter(activeCard => activeCard !== card))
            } else {
                setActiveCards([...activeCards, card])
            }
        } else {
            setActiveCards([card])
        }
        onChange(activeCards)
    }, [activeCards, canStayActiveMultipleCards])

    return (
        <div className="cards-container" ref={cardsContainer}>
            <div className="card add" onClick={onAddBtnClick}>
                <Plus />
            </div>
            {cardList && cardList.length > 0 && cardList.map((card) => (
                <Card
                    details={card}
                    key={card}
                    className={cardClassName}
                    active={activeCards.includes(card)}
                    onClick={e => {
                        defaultCardClickHandler(card)
                        onCardClick(e)
                    }}
                    compressText={true}
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
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    compressText?: boolean,
    showEditBtn?: boolean,
    onEditBtnClick?: (details: string) => void
}

export const Card: React.FC<CardProps> = memo(({
    details = "Sample",
    className = "",

    active = false,
    onClick = () => { },
    compressText = true,
    showEditBtn = false,
    onEditBtnClick = () => { }
}) => {
    const innerCard = (
        <div className={"card data " + className + (active ? ' active' : '')} onClick={onClick} title={details}>
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
    className: string,
    onChange?: (activeCards?: string[]) => void,
    cardClassName?: string,
    cardClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void,
    compressText?: boolean,
    showEditBtn?: boolean,
    editBtnClickHandler?: (details: string) => void,
    canStayActiveMultipleCards?: boolean
}

export const HorizentalCardsContainer: React.FC<HorizentalCardsContainerProps> = memo(({
    cardList = [],
    className = "",
    onChange = () => { },
    cardClassName = "",
    cardClickHandler = () => { },
    compressText,
    showEditBtn = false,
    editBtnClickHandler,
    canStayActiveMultipleCards = false
}) => {
    const cardsContainer = useRef<HTMLDivElement | null>(null)
    const [showArrow, setShowArrow] = useState(false)
    const [activeCards, setActiveCards] = useState<string[]>([])


    const defaultCardClickHandler = useCallback((card: string) => {
        if (canStayActiveMultipleCards) {
            if (activeCards.includes(card)) {
                setActiveCards(activeCards.filter(activeCard => activeCard !== card))
            } else {
                setActiveCards([...activeCards, card])
            }
        } else {
            setActiveCards([card])
        }
        onChange(activeCards)
    }, [activeCards, canStayActiveMultipleCards])

    const horizentalCardsOnWheelHandler = useCallback((event: React.WheelEvent) => {
        if (cardsContainer.current == null) return
        cardsContainer.current.scrollLeft += (event.deltaY);
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
            <Arrow className="left-arrow-for-scroll arrow-for-scroll" arrowStyle={{ zIndex: showArrow ? "1" : "-10" }} arrowIconClickHandler={() => { arrowClickHandler(-125) }} />
            <div className='sub-horizental-cards-container' ref={cardsContainer}>
                {cardList && cardList.length > 0 && cardList.map((card) => {
                    return (
                        <Card
                            details={card}
                            key={card}
                            className={cardClassName}
                            active={activeCards.includes(card)}
                            onClick={e => {
                                defaultCardClickHandler(card)
                                cardClickHandler(e)
                            }}
                            compressText={compressText}
                            showEditBtn={showEditBtn}
                            onEditBtnClick={editBtnClickHandler}
                        />
                    );
                })}
            </div>
            <Arrow className="right-arrow-for-scroll arrow-for-scroll" arrowIconClickHandler={() => { arrowClickHandler(125) }} />
        </div>
    )
})