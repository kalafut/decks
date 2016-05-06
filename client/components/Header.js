import React from 'react'
import { Link } from 'react-router'

class Header extends React.Component {
  render() {
    return(
      <div>
      <Link to="/decks">Deck List</Link>
      </div>
    )
  }
}

export default Header
