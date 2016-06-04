import request from 'superagent'
import { combineReducers } from 'redux'
import { nextId } from '../util'
import Immutable from 'seamless-immutable'


const DRILL = 0
const EDIT = 1
const STUDENT = 2
const MODE_CNT = 3

let defaultState = Immutable({
  page: 'DECK_LIST',
  decks: {},
  cards: {},
  deckcards: {}
})

const decksApp = (state = defaultState, action) => {
  let deck, decks

  switch (action.type) {
      case 'LOAD_DECKS':
          return state.set('decks', action.data)
      case 'LOAD_CARDS':
          return state.set('cards', action.data)
      case 'LOAD_DATA':
          return state.set({
            cards: action.data.cards,
            decks: action.data.decks,
            deckcards: action.data.deckcards
          })
      case 'GOTO_PAGE':
          return state.set('page', action.page)
      case 'ADD_DECK':
          deck = action.deck
          request
          .post('/api/v1/decks')
          .send(deck)
          .end((err, res) => {
            // TODO need to update temp ID with server ID here.
          })

          return state.setIn(['decks',deck.id], deck)

      case 'UPDATE_DECK':
          deck = action.deck
          request
          .put(`/api/v1/decks/${deck.id}`)
          .send(deck)
          .end((err, res) => {})

          return state.setIn(['decks',deck.id], deck)

      case 'DELETE_DECK':
          let id = action.id
          request
          .delete(`/api/v1/decks/${id}`)
          .end((err, res) => {})

          return state.set('decks', state.decks.without(id))

      case 'UPDATE_CARD':
          let card = action.card
          request
          .put(`/api/v1/cards/${card.id}`)
          .send(card)
          .end((err, res) => {})

          return state.setIn(['cards',card.id], card)
      default:
          return state
  }
}

export const requestDecks = (store) => {
    request
    .get('/api/decks')
    .end((err, res) => {
      store.dispatch({
        type: 'LOAD_DECKS',
        data: res.body
      })
    })
}

export const loadData = (store) => {
    request
    .get('/api/v1/decks')
    .end((err, res) => {
      store.dispatch({
        type: 'LOAD_DECKS',
        data: res.body
      })
    })

    request
    .get('/api/v1/cards')
    .end((err, res) => {
      store.dispatch({
        type: 'LOAD_CARDS',
        data: res.body
      })
    })
}

export default decksApp

