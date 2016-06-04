import React from 'react'

export default class CardInfoFields extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      front: props.card.front,
      back: props.card.back
    }
  }

  onFrontChange(e) {
    this.setState({front: e.target.value})
  }

  onBackChange(e) {
    this.setState({back: e.target.value})
  }

  render() {
    let deleteButton

    if(this.props.onDelete !== undefined) {
      deleteButton =
        <button type="button" onClick={()=>{
          this.props.onDelete(this.props.card)
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
          <h1>New/Edit Card</h1>
          <form className="pure-form pure-form-aligned">
            <fieldset>
              <div className="pure-control-group">
                <label for="front">front</label>
                <input type="text" value={this.state.front} onChange={this.onFrontChange.bind(this)}/>
              </div>

              <div className="pure-control-group">
                <label for="back">back</label>
                <input type="text" value={this.state.back} onChange={this.onBackChange.bind(this)}/>
              </div>
              <div className="pure-controls">
                <button type="button" onClick={()=>{
                  this.props.onSave(
                    this.props.card.set("front", this.state.front.trim()).set("back", this.state.back.trim())
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

