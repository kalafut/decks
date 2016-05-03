import React from 'react'
import { connect } from 'react-redux'

class DeckList extends React.Component {
  render() {
    return(
      <div className="pure-g">
        <div className="pure-u-1-5">
        </div>
        <div className="pure-u-3-5">
          <table>
            <tbody>
              {this.props.decks.map((deck) => {
                let name = deck.name
                if(deck.student !== null) {
                  name += ` (${deck.student})`
                }
                return (
                  <tr key={deck.id}><td><a href="#" onClick={() => this.props.deckEdit(deck.id)}>{name}</a></td></tr>
                  )
              })}
            </tbody>
          </table>
          <button className="pure-button" onClick={this.props.newDeck}>Add</button>
        </div>
        <div className="pure-u-1-5">
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { decks: state.decks }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deckEdit: (id) => { dispatch({ type: 'GOTO_PAGE', page: 'DECK_EDIT' }) },
    newDeck:  ()   => { dispatch({ type: 'GOTO_PAGE', page: 'newDeck' }) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckList)
