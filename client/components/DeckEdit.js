import React from 'react'
import { findById } from '../util'
import { withRouter } from 'react-router'
import DeckInfoFields from './DeckInfoFields'

class DeckEdit extends React.Component {
  updateDeck(deck) {
    if(deck.name.length > 0) {
      this.props.updateDeck(deck)
    }
  }

  render() {
    let name, student
    let deck = this.props.decks[this.props.params.id]

    if(deck === undefined) {
      return(
        <h1>Error</h1>
      )
    } else {
      return(
        <DeckInfoFields
          deck={deck}
          onSave={(deck) => {this.updateDeck(deck)}}
          onDelete={(id) => {this.props.deleteDeck(id)}}
          onEnd={() => { this.props.router.push('/decks') }}
        />
      )
    }
  }
}

export default withRouter(DeckEdit)
