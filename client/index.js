import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import decksApp from './reducers'
import App from './components/App'
import { loadData } from './reducers'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'
import NewDeck from './components/NewDeck'
import DeckList from './components/DeckList'
import DeckEdit from './components/DeckEdit'
import CardList from './components/CardList'
import CardEdit from './components/CardEdit'

let store = createStore(decksApp)

loadData(store)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="decks" />
        <Route path="decks" component={DeckList} />
        <Route path="cards" component={CardList} />
        <Route path="add_deck" component={NewDeck} />
      <Route path="decks/:id/edit" component={DeckEdit} />
      <Route path="cards/:id/edit" component={CardEdit} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
