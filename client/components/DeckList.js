import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class DeckList extends React.Component {
  render() {
    let decks = []

    for(let id in this.props.decks) {
      decks.push(this.props.decks[id])
    }

    return(
      <div className="pure-g">
        <div className="pure-u-1-5">
        </div>
        <div className="pure-u-3-5">
          <table>
            <tbody>
              {decks.map((deck) => {
                let name = deck.name
                if(deck.student !== null) {
                  name += ` (${deck.student})`
                }
                return (
                  <tr key={deck.id}><td><Link to={`/deck/${deck.id}/edit`}>{name}</Link></td></tr>
                  )
              })}
            </tbody>
          </table>
          <Link className="pure-button" to="/add_deck">Add</Link>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckList)
