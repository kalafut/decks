import React from 'react'
import { connect } from 'react-redux'
import { findById } from '../util'
import { withRouter } from 'react-router'

class DeckEdit extends React.Component {
  deck() {
    let deck = findById(parseInt(this.props.params.id), this.props.decks)
    return deck || {name:"Nothing"}
  }

  render() {
    let name, student
    let deck = this.props.decks[this.props.params.id]

    if(deck === undefined) {
      return(
        <h1>Error</h1>
      )
    } else {
      return(
        <div>
          <div className="pure-g">
            <div className="pure-u-1-5">
            </div>
            <div className="pure-u-3-5">
              <h1>Edit Deck</h1>
              <form className="pure-form pure-form-aligned">
                <fieldset>
                  <div className="pure-control-group">
                    <label for="name">Name</label>
                    <input ref={node => { name = node }} id="name" type="text" defaultValue={deck.name}/>
                  </div>

                  <div className="pure-control-group">
                    <label for="student">Student</label>
                    <input ref={node => { student = node }} id="student" type="text" defaultValue={deck.student}/>
                  </div>
                  <div className="pure-controls">
                    <button type="button" onClick={()=>{
                      let newDeck = {
                        id: deck.id,
                        name: name.value.trim(),
                        student: student.value.trim()
                      }
                      this.props.onSave(newDeck)
                      this.props.router.push('/decks')
                    }}
                    className="pure-button pure-button-primary">Save</button>
                </div>
              </fieldset>
            </form>
          </div>
          <div class="pure-u-1-5">
          </div>
        </div>
      </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    cards: state.cards,
    decks: state.decks,
    deckcards: state.deckcards
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (newDeck) => {
      dispatch({
        type: 'UPDATE_DECK',
        deck: newDeck
      })
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckEdit))
