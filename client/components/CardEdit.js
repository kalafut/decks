import React from 'react'
import { connect } from 'react-redux'
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
          onSave={this.props.onSave}
          onDelete={this.props.onDelete}
          onEnd={() => { this.props.router.push('/cards') }}
        />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    cards: state.cards,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (card) => {
      dispatch({
        type: 'UPDATE_CARD',
        card: card
      })
    },
    onDelete: (card) => {
      dispatch({
        type: 'DELETE_CARD',
        id: card.id
      })
    }
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CardEdit))
