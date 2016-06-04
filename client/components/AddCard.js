import React from 'react'
import Immutable from 'seamless-immutable'
import { nextId } from '../util'
import { withRouter } from 'react-router'
import DeckInfoFields from './DeckInfoFields'

class NewDeck extends React.Component {
  addDeck(deck) {
    if(deck.name.length > 0) {
      this.props.addDeck(deck)
    }
  }

  render() {
    let deck = Immutable({ id: nextId(), name: "", student: "" })

    return (
      <DeckInfoFields deck={deck} onSave={(deck) => {this.addDeck(deck)}} onEnd={() => { this.props.router.push('/decks') }} />
    )
  }
}

export default withRouter(NewDeck)


