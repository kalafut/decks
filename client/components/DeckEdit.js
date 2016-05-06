import React from 'react'
import { findById } from '../util'
import { withRouter } from 'react-router'
import DeckInfoFields from './DeckInfoFields'

class DeckEdit extends React.Component {
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
          onSave={(deck) => {this.props.updateDeck(deck)}}
          onDelete={(id) => {this.props.deleteDeck(id)}}
          onEnd={() => { this.props.router.push('/decks') }}
        />
      )
    }
  }
}

export default withRouter(DeckEdit)
