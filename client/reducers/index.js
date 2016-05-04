import request from 'superagent'
import { combineReducers } from 'redux'
import { nextId } from '../util'

const DRILL = 0
const EDIT = 1
const STUDENT = 2
const MODE_CNT = 3

let defaultState = {
  page: 'DECK_LIST',
  decks: {},
  cards: {},
  deckcards: {}
}

const decksApp = (state = defaultState, action) => {
  let deck, decks

  switch (action.type) {
      case 'LOAD_DECKS':
          return Object.assign({}, state, {
            decks: action.data.decks
          })
      case 'LOAD_DATA':
          return Object.assign({}, state, {
            cards: action.data.cards,
            decks: action.data.decks,
            deckcards: action.data.deckcards
          })
      case 'GOTO_PAGE':
          return Object.assign({}, state, {
            page: action.page
          })
      case 'ADD_DECK':
          deck = action.deck
          request
          .post('/api/decks')
          .send({name:deck.name, student:deck.student})
          .end((err, res) => {})

          decks = Object.assign({}, state.decks, {
            id: deck
          })
          return Object.assign({}, state, {
            decks: decks
          })
      case 'UPDATE_DECK':
          deck = action.deck
          request
          .put('/api/v1/decks')
          .send(deck)
          .end((err, res) => {})

          decks = Object.assign({}, state.decks)
          decks[deck.id] = deck

          return Object.assign({}, state, {
            decks: decks
          })
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
    .get('/api/v1/data')
    .end((err, res) => {
      store.dispatch({
        type: 'LOAD_DATA',
        data: res.body
      })
    })
}

export default decksApp

