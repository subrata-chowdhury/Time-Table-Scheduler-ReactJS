import Plus from "../Icons/Plus";
import "../Style/Cards.css"

export default function Cards({ cardDetails = ["UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI", "UI"], cardClickHandler = () => { } }) {
    let cards = [];
    for (let index = 0; index < cardDetails.length; index++) {
        cards.push(<Card details={cardDetails[index]} key={index} cardClickHandler={cardClickHandler}></Card>)
    }
    return (
        <div className="cards-container">
            <div className="card add">
                <Plus />
            </div>

            {cards}
        </div>
    )
}

export function Card({ details = "Sample", cardClickHandler }) {
    return (
        <div className="card data" onClick={cardClickHandler}>
            <div>{details}</div>
        </div>
    )
}