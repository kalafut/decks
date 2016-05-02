import React from 'react'
import { connect } from 'react-redux'
import { nextMode } from '../actions'

class Header extends React.Component {
  render() {
    return(
      <div>
      This is a header.
      </div>
    )
  }
}

export default Header
//export default connect(mapStateToProps, mapDispatchToProps)(Header)
