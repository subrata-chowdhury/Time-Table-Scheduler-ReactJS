import Plus from "../Icons/Plus";
import "../Style/Cards.css"
import Arrow from '../Icons/Arrow'
import { memo, useCallback, useRef, useState } from "react";
import EditIcon from "../Icons/Edit";

function Cards({
    cardDetails = [],
    cardClassName,
    cardClickHandler = () => { },
    addBtnClickHandler = () => { },
    canStayActiveMultipleCards = false,
    cardsContainer = useRef(),
    showEditBtn = false
}) {

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

export const Card = memo(({
    details = "Sample",
    className = "",
    cardClickHandler = () => { },
    compressText = true,
    canStayActiveMultipleCards,
    cardsContainer,
    showEditBtn,
    editBtnClickHandler = () => { }
}) => {
    const defaultClickHandler = useCallback((event) => {
        event.stopPropagation();
        try {
            if (!canStayActiveMultipleCards) {
                let activeCard = "";
                if (className)
                    activeCard = cardsContainer.current.querySelector(".card.data.active." + className)
                else
                    activeCard = cardsContainer.current.querySelector(".card.data.active")
                if (activeCard)
                    activeCard.classList.remove("active");
            }
        } catch (error) {
            console.log("%cError in deselecting card", "color: orange")
        }
        if (canStayActiveMultipleCards) {
            let currentTargetClasses = event.currentTarget.classList;
            let found = false
            for (let index = 0; index < currentTargetClasses.length; index++) {
                if (currentTargetClasses[index] === "active") {
                    found = true
                    event.currentTarget.classList.remove("active")
                    break
                }
            }
            if (!found) {
                event.currentTarget.classList.add("active")
            }
        } else event.currentTarget.classList.add("active")
    }, [canStayActiveMultipleCards])

    let cardStyle = {}
    if (showEditBtn) cardStyle = { position: "relative", top: "-20px" }

    const innerCard = (<div className={"card data " + className} onClick={(e) => {
        cardClickHandler(e)
        defaultClickHandler(e)
    }} title={details} style={cardStyle}>
        {compressText ? (details.length > 6 ? details.slice(0, 5) + ".." : details) : details}
    </div>)
    return (
        (showEditBtn ? (
            <div className="card-wrapper">
                <div className="edit-btn" onClick={() => { editBtnClickHandler(details) }}><EditIcon /></div>
                {innerCard}
            </div>
        ) : innerCard)
    )
})

export const HorizentalCardsContainer = memo(({
    cardData = [],
    className = "",
    cardClassName,
    cardClickHandler,
    compressText,
    cardsContainer = useRef(),
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
    const horizentalCardsOnWheelHandler = useCallback((event) => {
        cardsContainer.current.scrollLeft += (event.deltaY);
    }, [])
    const arrowClickHandler = useCallback((value) => {
        cardsContainer.current.scrollLeft += value;
        showLeftArrow()
    }, [])
    const [showArrow, setShowArrow] = useState(false)
    const showLeftArrow = useCallback(() => {
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