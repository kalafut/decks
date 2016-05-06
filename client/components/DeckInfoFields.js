import React from 'react'

export default class DeckInfoFields extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.deck.name,
      student: props.deck.student
    }
  }

  onNameChange(e) {
    this.setState({name: e.target.value})
  }

  onStudentChange(e) {
    this.setState({student: e.target.value})
  }

  render() {
    let deleteButton

    if(this.props.onDelete !== undefined) {
      deleteButton =
        <button type="button" onClick={()=>{
          this.props.onDelete(this.props.deck.id)
          this.props.onEnd()
        }}
        className="pure-button button-error">Delete
      </button>
    }
    return(
      <div className="pure-g">
        <div className="pure-u-1-5">
        </div>
        <div className="pure-u-3-5">
          <h1>New/Edit Deck</h1>
          <form className="pure-form pure-form-aligned">
            <fieldset>
              <div className="pure-control-group">
                <label for="name">Name</label>
                <input type="text" value={this.state.name} onChange={this.onNameChange.bind(this)}/>
              </div>

              <div className="pure-control-group">
                <label for="student">Student</label>
                <input type="text" value={this.state.student} onChange={this.onStudentChange.bind(this)}/>
              </div>
              <div className="pure-controls">
                <button type="button" onClick={()=>{
                  this.props.onSave(
                    this.props.deck.set("name", this.state.name.trim()).set("student", this.state.student.trim())
                  )
                  this.props.onEnd()
                }}
                className="pure-button pure-button-primary">Save</button>
                {deleteButton}
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
