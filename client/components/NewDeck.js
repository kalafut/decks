import React from 'react'
import { nextId } from '../util'
import { withRouter } from 'react-router'
import DeckInfoFields from './DeckInfoFields'

class NewDeck extends React.Component {
  render() {
    let deck = { id: nextId(), name: "", student: "" }

    return (
      <DeckInfoFields deck={deck} onSave={(deck) => {this.props.addDeck(deck)}} onEnd={() => { this.props.router.push('/decks') }} />
    )
  }
}

export default withRouter(NewDeck)

