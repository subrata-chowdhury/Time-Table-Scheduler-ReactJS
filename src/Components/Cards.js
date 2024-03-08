import Plus from "../Icons/Plus";
import "../Style/Cards.css"
import Arrow from '../Icons/Arrow'

export default function Cards({ cardDetails = [], cardClassName, cardClickHandler = () => { }, addBtnClickHandler }) {
    let cards = [];
    for (let index = 0; index < cardDetails.length; index++) {
        cards.push(<Card details={cardDetails[index]} key={index} cardClickHandler={cardClickHandler} className={cardClassName}></Card>)
    }
    return (
        <div className="cards-container">
            <div className="card add" onClick={addBtnClickHandler}>
                <Plus />
            </div>

            {cards}
        </div>
    )
}

export function Card({ details = "Sample", className = "", cardClickHandler = () => { }, compressText = true }) {
    function defaultClickHandler(event) {
        event.stopPropagation();
        try {
            if (className === "")
                document.querySelector(".card.data.active").classList.remove("active");
            else
                document.querySelector(".card.data.active." + className).classList.remove("active");
        } catch (error) { }
        event.currentTarget.classList.add("active")
    }
    return (
        <div className={"card data " + className} onClick={event => {
            cardClickHandler(event);
            defaultClickHandler(event);
        }} title={details}>
            {compressText ? (details.length > 6 ? details.slice(0, 5) + ".." : details) : details}
        </div>
    )
}

export function HorizentalCardsContainer({ cardData = [], className = "", cardClassName, cardClickHandler, compressText }) {
    let cards = [];
    for (let index = 0; index < cardData.length; index++) {
        cards.push(<Card details={cardData[index]} key={index} className={cardClassName} cardClickHandler={cardClickHandler} compressText={compressText} />)
    }
    return (
        <div className={'horizental-cards-container ' + className}>
            <Arrow className="left-arrow-for-scroll arrow-for-scroll" />
            <div className='sub-horizental-cards-container'>
                {cards}
            </div>
            <Arrow className="right-arrow-for-scroll arrow-for-scroll" />
        </div>
    )
}