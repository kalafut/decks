import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'seamless-immutable'
import { nextId } from '../util'
import { withRouter } from 'react-router'
import DeckInfoFields from './DeckInfoFields'

class NewDeck extends React.Component {
  render() {
    let deck = Immutable({ id: nextId(), name: "", student: "" })
    return (
      <DeckInfoFields deck={deck} onSave={this.props.onSave} onEnd={() => { this.props.router.push('/decks') }} />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (deck) => {
      if(deck.name.length > 0) {
        dispatch({
          type: 'ADD_DECK',
          deck: deck
        })
      }
    }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(NewDeck))

