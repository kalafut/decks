import React from 'react'
import { Link } from 'react-router'
import Immutable from 'seamless-immutable'

class DeckList extends React.Component {
  render() {
    let decks = []

    for(let id in this.props.decks) {
      decks.push(Immutable(this.props.decks[id]))
    }

    return(
      <div className="pure-g">
        <div className="pure-u-1-5">
        </div>
        <div className="pure-u-3-5">
          <table className="pure-table pure-table-horizontal" style={{width:'50%'}}>
            <tbody>
              {decks.map((deck) => {
                let name = deck.name
                if(deck.student !== "") {
                  name += ` (${deck.student})`
                }
                return (
                  <tr key={deck.id}><td>{name}</td><td><Link to={`/deck/${deck.id}/edit`}><i className="fa fa-play fa-lg"></i></Link></td><td><Link to={`/deck/${deck.id}/edit`}><i className="fa fa-pencil fa-lg"></i></Link></td></tr>
                  )
              })}
              <tr><td colSpan="3" className="center"><Link to="/add_deck"><i className="fa fa-plus fa-lg"></i></Link></td></tr>
            </tbody>
          </table>
        </div>
        <div className="pure-u-1-5">
        </div>
      </div>
    )
  }
}

export default DeckList
