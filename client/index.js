import React from 'react';
import { render } from 'react-dom'
import App from './components/App'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'
import NewDeck from './components/NewDeck'
import DeckList from './components/DeckList'
import DeckEdit from './components/DeckEdit'
import CardList from './components/CardList'

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="decks" />
      <Route path="decks" component={DeckList} />
      <Route path="cards" component={CardList} />
      <Route path="add_deck" component={NewDeck} />
      <Route path="deck/:id/edit" component={DeckEdit} />
    </Route>
  </Router>,
  document.getElementById('root')
)
