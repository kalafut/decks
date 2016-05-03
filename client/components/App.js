import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Page from './Page'
/*
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
*/

const App = () => (
  <div>
    <Header/>
    <Page />
  </div>
)

export default App
