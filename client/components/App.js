import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Page from './Page'
import DeckList from './DeckList'
import { Link } from 'react-router'
/*
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
*/

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hi!</h1>
        <Link to="/decklist">Test</Link>
        <Header/>
        {this.props.children}
      </div>
    )
  }
}

export default App
