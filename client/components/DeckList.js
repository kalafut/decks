import React from 'react'
import { connect } from 'react-redux'
import { deckEdit } from '../actions'

class DeckList extends React.Component {
  render() {
    return(
      <div>
      <ul>
        {this.props.decks.map((deck) => {
          let name = deck.name
          if(deck.student !== "") {
            name += ` (${deck.student})`
          }
          return (<li key={deck.id}>{name} <button onClick={() => this.props.deckEdit(deck.id)}>Edit</button></li>)
        })}
      </ul>
      <button>Add</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { decks: state.decks }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deckEdit: (id) => { 
      console.log(id)
      console.log(deckEdit(id))
      dispatch(deckEdit(id)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckList)
