import React from 'react'
import { connect } from 'react-redux'
import DeckList from './DeckList'
import CardList from './CardList'
import DeckEdit from './DeckEdit'

class Page extends React.Component {
  render() {
    switch(this.props.page) {
        case 'DECK_LIST':
            return <DeckList />
        case 'DECK_EDIT':
            return <DeckEdit />
        case 1:
            return <CardList />
        default:
            throw("Unknown page: " + this.props.page)
    }
  }
}

const mapStateToProps = (state) => {
  return { page: state.page }
}

export default connect(mapStateToProps)(Page)
