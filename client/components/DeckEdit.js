import React from 'react'
import { connect } from 'react-redux'

class DeckEdit extends React.Component {
  render() {
    return(
      <div>
        <h1>Edit Deck</h1>
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

const mapStateToProps = (state) => {
  return { decks: state.decks }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //onNextMode: () => { dispatch(nextMode()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckEdit)

