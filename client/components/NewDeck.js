import React from 'react'
import { connect } from 'react-redux'
import { nextId } from '../util'
import { withRouter } from 'react-router'

class NewDeck extends React.Component {
  render() {
    let name, student

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
                <input ref={node => { name = node }} id="name" type="text" placeholder="Name"/>
              </div>

              <div className="pure-control-group">
                <label for="student">Student</label>
                <input ref={node => { student = node }} id="student" type="text" placeholder="Student"/>
              </div>
              <div className="pure-controls">
                <button type="button" onClick={()=>{
                  this.props.onSave(name.value.trim(), student.value.trim())
                  this.props.router.push('/decklist')
                }}
                className="pure-button pure-button-primary">Save</button>
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
    onSave: (name, student) => {
      if(name.length > 0) {
        dispatch({
          type: 'ADD_DECK',
          deck: {
            id: nextId(),
            name: name,
            student: student
          }})
      }
      //dispatch({ type: 'GOTO_PAGE', page: 'DECK_LIST' })
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewDeck))

