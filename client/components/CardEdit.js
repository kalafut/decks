import React from 'react'
import { withRouter } from 'react-router'
import CardInfoFields from './CardInfoFields'

class CardEdit extends React.Component {
  updateCard(card) {
    if(card.front.length > 0) {
      this.props.updateCard(card)
    }
  }

  render() {
    let name, student
    let card = this.props.cards[this.props.params.id]

    if(card === undefined) {
      return(
        <h1>Error</h1>
      )
    } else {
      return(
        <CardInfoFields
          card={card}
          onSave={(card) => {this.updateCard(card)}}
          onDelete={(id) => {this.props.deleteCard(id)}}
          onEnd={() => { this.props.router.push('/cards') }}
        />
      )
    }
  }
}

export default withRouter(CardEdit)
