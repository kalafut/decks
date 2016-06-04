import React from 'react'
import { connect } from 'react-redux'
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
        <DeckInfoFields deck={deck} onSave={this.props.onSave} onDelete={this.props.onDelete} onEnd={() => { this.props.router.push('/decks') }} />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    decks: state.decks,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (deck) => {
      dispatch({
        type: 'UPDATE_DECK',
        deck: deck
      })
    },
    onDelete: (deck) => {
      dispatch({
        type: 'DELETE_DECK',
        id: deck.id
      })
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckEdit))
