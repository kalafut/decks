import React from 'react'
import { connect } from 'react-redux'

class NewDeck extends React.Component {
  render() {
    return(
      <div className="pure-g">
        <div className="pure-u-1-5">
        </div>
        <div className="pure-u-3-5">
          <h1>New Deck</h1>
          <form className="pure-form pure-form-aligned">
            <fieldset>
              <div className="pure-control-group">
                <label for="name">Name</label>
                <input id="name" type="text" placeholder="Name"/>
              </div>

              <div className="pure-control-group">
                <label for="student">Student</label>
                <input id="student" type="text" placeholder="Student"/>
              </div>
              <div className="pure-controls">
                <button className="pure-button pure-button-primary">Save</button>
              </div>
            </fieldset>
          </form>
        </div>
        <div class="pure-u-1-5">
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
    //onNextMode: () => { dispatch(nextMode()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDeck)

