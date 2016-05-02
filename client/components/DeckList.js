import React from 'react'
import { connect } from 'react-redux'
import { deckEdit, newDeck } from '../actions'

class DeckList extends React.Component {
  render() {
    return(
      <div>
      <ul>
        {this.props.decks.map((deck) => {
          let name = deck.name
          if(deck.student !== null) {
            name += ` (${deck.student})`
          }
          return (<li key={deck.id}>{name} <button onClick={() => this.props.deckEdit(deck.id)}>Edit</button></li>)
        })}
      </ul>
      <button onClick={this.props.newDeck}>Add</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { decks: state.decks }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deckEdit: (id) => { dispatch(deckEdit(id)) },
    newDeck:  ()   => { dispatch(newDeck()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckList)
