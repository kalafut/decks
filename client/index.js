import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import decksApp from './reducers'
import App from './components/App'
import { requestDecks } from './reducers'
import { Router, Route, IndexRedirect, Link, hashHistory } from 'react-router'
import NewDeck from './components/NewDeck'
import DeckList from './components/DeckList'
import DeckEdit from './components/DeckEdit'

let store = createStore(decksApp)

requestDecks(store)

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="decklist" />
        <Route path="decklist" component={DeckList} />
        <Route path="add_deck" component={NewDeck} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
