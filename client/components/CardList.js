import React from 'react'

class CardList extends React.Component {
  render() {
    return(
      <div>
      <h2>Cards</h2>
      <table className="pure-table pure-table-bordered">
      <tbody>
        {this.props.cards.map((card) => {
          return (
            <tr key={card.id}><td>{card.front}</td><td>{card.back}</td></tr>
          )
        })}
      </tbody>
      </table>
      </div>
    )
  }
}

export default CardList

