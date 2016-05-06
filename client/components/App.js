import React from 'react'
import Header from './Header'
import DeckList from './DeckList'
import { Link } from 'react-router'
import request from 'superagent'
import update from 'react-addons-update'
import Immutable from 'seamless-immutable'


class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      decks: Immutable({}),
      cards: Immutable({}),
      deckcards: Immutable({})
    }
    this.loadData()
  }

  loadData() {
    request
    .get('/api/v1/decks')
    .end((err, res) => {
      this.setState({ decks: Immutable(res.body) })
    })
  }

  addDeck(deck) {
    this.setState({ decks: this.state.decks.set(deck.id, deck) })
    request
    .post('/api/v1/decks')
    .send(deck)
    .end(((oldId) => {
      return (err, res) => {
        this.setState({ decks: this.state.decks.merge(res.body).without(oldId.toString()) })
      }})(deck.id))
  }

  updateDeck(deck) {
    this.setState({ decks: this.state.decks.set(deck.id, deck) })
    request
    .put(`/api/v1/decks/${deck.id}`)
    .send(deck)
    .end((err, res) => {})
  }

  deleteDeck(id) {
    this.setState({ decks: this.state.decks.without(id.toString()) })
    request
    .delete(`/api/v1/decks/${id}`)
    .end((err, res) => {})
  }

  render() {
    return (
      <div>
      <Header/>
      {this.props.children &&
        React.cloneElement(this.props.children,
                           {
                             decks: this.state.decks,
                             cards: this.state.cards,
                             deckcards: this.state.deckcards,
                             addDeck: this.addDeck.bind(this),
                             updateDeck: this.updateDeck.bind(this),
                             deleteDeck: this.deleteDeck.bind(this)
                           })}
      </div>
    )
  }
}

export default App
