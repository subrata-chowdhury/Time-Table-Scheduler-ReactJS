import Plus from "../Icons/Plus";
import "../Style/Cards.css"

export default function Cards({ cardDetails = ["UI", "UI", "UI"], cardClickHandler= ()=>{} }) {
    let cards = [];
    for (let index = 0; index < cardDetails.length; index++) {
        cards.push(<Card details={cardDetails[index]} key={index} onClick={cardClickHandler}></Card>)
    }
    return (
        <div className="cards-container">
            <div className="card">
                <Plus/>
            </div>

            {cards}
        </div>
    )
}

function Card({ details = "Sample" }) {
    return (
        <div className="card">
            <div>{details}</div>
        </div>
    )
}