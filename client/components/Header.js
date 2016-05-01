import React from 'react'
import { connect } from 'react-redux'
import { nextMode } from '../actions'

class Header extends React.Component {
  render() {
    return(
      <div>
      This is a header. We're in mode: {this.props.mode}
      <br/>
      <button onClick={this.props.onNextMode} className="pure-button">Press Me</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { mode: state.mode }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onNextMode: () => { dispatch(nextMode()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
