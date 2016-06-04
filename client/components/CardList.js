import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'seamless-immutable'
import { Link } from 'react-router'

class CardList extends React.Component {
  render() {
    let cards = []

    for(let id in this.props.cards) {
      cards.push(Immutable(this.props.cards[id]))
    }

    return(
      <div>
      <h2>Cards</h2>
      <div className="pure-g">
        <div className="pure-u-1-5">
        </div>
        <div className="pure-u-3-5">
          <table className="pure-table pure-table-horizontal" style={{width:'50%'}}>
          <tbody>
          {cards.map((card) => {
            return (
              <tr key={card.id}><td>{card.front}</td><td>{card.back}</td><td><Link to={`/cards/${card.id}/edit`}><i className="fa fa-pencil fa-lg"></i></Link></td></tr>
            )
          })}
          <tr><td colSpan="3" className="center"><Link to="/add_card"><i className="fa fa-plus fa-lg"></i></Link></td></tr>
          </tbody>
          </table>
        </div>
        <div className="pure-u-1-5">
        </div>
      </div>
    </div>

    )
  }
}

const mapStateToProps = (state) => {
  return { cards: state.cards }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //onNextMode: () => { dispatch(nextMode()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardList)

