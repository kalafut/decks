import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'seamless-immutable'
import { nextId } from '../util'
import { withRouter } from 'react-router'
import CardInfoFields from './CardInfoFields'

class CardAdd extends React.Component {
  render() {
    let card = Immutable({ id: nextId(), front: "", back: ""})
    return (
      <CardInfoFields card={card} onSave={this.props.onSave} onEnd={() => { this.props.router.push('/cards') }} />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (card) => {
      if(card.front.length > 0) {
        dispatch({
          type: 'ADD_CARD',
          card: card
        })
      }
    }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(CardAdd))


