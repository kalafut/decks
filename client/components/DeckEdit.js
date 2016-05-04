import React from 'react'
import { connect } from 'react-redux'
import { findById } from '../util'

class DeckEdit extends React.Component {
  deck() {
    let deck = findById(parseInt(this.props.params.id), this.props.decks)
    return deck || {name:"Nothing"}
  }

  render() {
    let deck = this.props.decks[this.props.params.id]

    if(deck === undefined) {
      return(
        <h1>Error</h1>
      )
    } else {
      return(
        <div>
          <h1>{this.props.decks[this.props.params.id].name}</h1>
          <form class="pure-form pure-form-aligned">
            <fieldset>
              <div class="pure-control-group">
                <label for="name">Username</label>
                <input id="name" type="text" placeholder="Username"/>
              </div>

              <div class="pure-control-group">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Password"/>
              </div>

              <div class="pure-control-group">
                <label for="email">Email Address</label>
                <input id="email" type="email" placeholder="Email Address"/>
              </div>

              <div class="pure-control-group">
                <label for="foo">Supercalifragilistic Label</label>
                <input id="foo" type="text" placeholder="Enter something here..."/>
              </div>

              <div class="pure-controls">
                <label for="cb" class="pure-checkbox">
                  <input id="cb" type="checkbox"/> I've read the terms and conditions
                </label>

                <button type="submit" class="pure-button pure-button-primary">Submit</button>
              </div>
            </fieldset>
          </form>
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
    //onNextMode: () => { dispatch(nextMode()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckEdit)

